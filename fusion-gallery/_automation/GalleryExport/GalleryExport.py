import adsk.core
import adsk.fusion
import json
import os
import traceback
import time

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, '..', '..'))

def write_json(name, value):
    path = os.path.join(OUT, name)
    with open(path + '.tmp', 'w', encoding='utf-8') as stream:
        json.dump(value, stream, indent=2)
    os.replace(path + '.tmp', path)

def items(collection):
    return [collection.item(i) for i in range(collection.count)]

def folder_record(folder, prefix):
    result = {'name': folder.name, 'id': folder.id, 'path': prefix,
              'files': [], 'folders': []}
    for file in items(folder.dataFiles):
        result['files'].append({'name': file.name, 'id': file.id,
                                'extension': file.fileExtension,
                                'version': file.versionNumber,
                                'has_children': file.hasChildReferences,
                                'has_parents': file.hasParentReferences})
    for child in items(folder.dataFolders):
        result['folders'].append(folder_record(child, prefix + '/' + child.name))
    return result

def image(app, filename, orientation):
    viewport = app.activeViewport
    camera = viewport.camera
    camera.cameraType = adsk.core.CameraTypes.OrthographicCameraType
    camera.viewOrientation = orientation
    camera.isSmoothTransition = False
    camera.isFitView = True
    viewport.camera = camera
    viewport.refresh()
    adsk.doEvents()
    camera = viewport.camera
    ok, width, height = camera.getExtents()
    if ok:
        camera.isFitView = False
        camera.setExtents(width * 1.15, height * 1.15)
        viewport.camera = camera
        viewport.refresh()
        adsk.doEvents()
    opts = adsk.core.SaveImageFileOptions.create(filename)
    opts.width = 2400
    opts.height = 1600
    opts.isAntiAliased = True
    opts.isBackgroundTransparent = False
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    if not viewport.saveAsImageFileWithOptions(opts):
        raise RuntimeError('Image export returned false: ' + filename)

def run(context):
    app = adsk.core.Application.get()
    result = {'status': 'running', 'mode': 'inventory'}
    write_json('status.json', result)
    try:
        with open(os.path.join(HERE, 'config.json'), encoding='utf-8') as stream:
            config = json.load(stream)
        result['mode'] = config['mode']
        if config['mode'] == 'wall_sample':
            if not app.activeDocument or not app.activeDocument.name.startswith('WallMount'):
                raise RuntimeError('WallMount must be active for its final captures')
            viewport = app.activeViewport
            saved_camera, saved_style = viewport.camera, viewport.visualStyle
            try:
                viewport.visualStyle = adsk.core.VisualStyles.ShadedVisualStyle
                for label, orientation in [
                    ('Isometric', adsk.core.ViewOrientations.IsoTopRightViewOrientation),
                    ('Front', adsk.core.ViewOrientations.FrontViewOrientation),
                    ('Right', adsk.core.ViewOrientations.RightViewOrientation),
                    ('Top', adsk.core.ViewOrientations.TopViewOrientation)]:
                    image(app, os.path.join(OUT, 'Fun', 'WallMount', 'WallMount_' + label + '.png'), orientation)
            finally:
                viewport.camera = saved_camera
                viewport.visualStyle = saved_style
                viewport.refresh()
            result['status'] = 'complete'
            write_json('status.json', result)
            return
        projects = items(app.data.dataProjects)
        result['projects'] = [{'name': p.name, 'id': p.id} for p in projects]
        personal = [p for p in projects if p.name == 'Personal']
        fun = [p for p in projects if p.name == 'Fun']
        if len(personal) != 1 or len(fun) != 1:
            raise RuntimeError('Expected unique Personal and Fun projects')
        if config['mode'] == 'inventory':
            result['personal'] = folder_record(personal[0].rootFolder, 'Personal')
            desk = fun[0].rootFolder.dataFolders.itemByName('Desk')
            if not desk:
                raise RuntimeError('Fun/Desk folder was not found')
            result['desk'] = folder_record(desk, 'Fun/Desk')
            write_json('inventory.json', result)
            if app.activeDocument.name.startswith('WallMount'):
                camera = app.activeViewport.camera
                try:
                    image(app, os.path.join(OUT, 'Fun', 'WallMount', 'WallMount_Front.png'),
                          adsk.core.ViewOrientations.FrontViewOrientation)
                    result['front_sample'] = True
                finally:
                    app.activeViewport.camera = camera
                    app.activeViewport.refresh()
        elif config['mode'] == 'capture':
            result.pop('projects', None)
            result['renames'] = []
            result['captured'] = []
            result['skipped'] = []
            result['failures'] = []
            destination = personal[0].rootFolder.dataFolders.itemByName('WTC')
            for rename in config.get('renames', []):
                file = destination.dataFiles.itemById(rename['id'])
                if not file or file.name not in [rename['old'], rename['new']]:
                    raise RuntimeError('Rename source did not match: ' + rename['old'])
                if file.name == rename['old']:
                    file.name = rename['new']
                result['renames'].append({'id': file.id, 'old': rename['old'],
                                          'new': file.name, 'verified': file.name == rename['new']})
                write_json('status.json', result)
            write_json('naming-map.json', result['renames'])
            original = app.activeDocument
            existing_ids = {d.dataFile.id for d in items(app.documents) if d.dataFile}
            orientations = [('Isometric', adsk.core.ViewOrientations.IsoTopRightViewOrientation),
                            ('Front', adsk.core.ViewOrientations.FrontViewOrientation),
                            ('Right', adsk.core.ViewOrientations.RightViewOrientation),
                            ('Top', adsk.core.ViewOrientations.TopViewOrientation)]
            for target in config['targets']:
                doc = None
                viewport = None
                saved_visibility = []
                saved_camera = None
                saved_style = None
                result['current'] = target['path'] + '/' + target['name']
                write_json('status.json', result)
                try:
                    folder = personal[0].rootFolder
                    for segment in target['path'].split('/')[1:]:
                        folder = folder.dataFolders.itemByName(segment)
                        if not folder:
                            raise RuntimeError('Capture folder not found')
                    file = folder.dataFiles.itemById(target['id'])
                    if not file:
                        raise RuntimeError('Capture file not found')
                    doc = app.documents.open(file, True)
                    if not doc:
                        raise RuntimeError('Document did not open')
                    doc.activate()
                    adsk.doEvents()
                    design = adsk.fusion.Design.cast(app.activeProduct)
                    if not design:
                        result['skipped'].append({'name':file.name,'reason':'No 3D design product'})
                        continue
                    root = design.rootComponent
                    body_count = sum(c.bRepBodies.count + c.meshBodies.count for c in items(design.allComponents))
                    if body_count == 0:
                        result['skipped'].append({'name':file.name,'reason':'No solid or mesh geometry'})
                        continue
                    box = root.boundingBox
                    dims = [(box.maxPoint.x-box.minPoint.x)*10,
                            (box.maxPoint.y-box.minPoint.y)*10,
                            (box.maxPoint.z-box.minPoint.z)*10]
                    if max(dims) < 60 and not file.hasChildReferences and not target.get('force', False):
                        result['skipped'].append({'name':file.name,'reason':'Small standalone part','dimensions_mm':dims})
                        continue
                    viewport = app.activeViewport
                    saved_camera = viewport.camera
                    saved_style = viewport.visualStyle
                    viewport.visualStyle = adsk.core.VisualStyles.ShadedVisualStyle
                    for component in items(design.allComponents):
                        for prop in ['isSketchFolderLightBulbOn', 'isConstructionFolderLightBulbOn', 'isOriginFolderLightBulbOn']:
                            try:
                                old = getattr(component, prop)
                                if old:
                                    setattr(component, prop, False)
                                    saved_visibility.append((component, prop, old))
                            except Exception:
                                pass
                    stem = file.name.replace('/', '-').replace('\\', '-')
                    folder_out = os.path.join(OUT, *target['path'].split('/'), stem)
                    entry = {'name':file.name, 'id':file.id, 'source_path':target['path'],
                             'version':file.versionNumber, 'dimensions_mm':dims,
                             'body_count':body_count, 'images':[]}
                    for label, orientation in orientations:
                        filename = os.path.join(folder_out, stem + '_' + label + '.png')
                        image(app, filename, orientation)
                        entry['images'].append({'view':label, 'path':os.path.relpath(filename, OUT).replace('\\','/')})
                        adsk.doEvents()
                    result['captured'].append(entry)
                except Exception:
                    result['failures'].append({'name':target['name'], 'error':traceback.format_exc()})
                finally:
                    for component, prop, old in reversed(saved_visibility):
                        try:
                            setattr(component, prop, old)
                        except Exception:
                            pass
                    if viewport and saved_camera:
                        viewport.camera = saved_camera
                    if viewport and saved_style is not None:
                        viewport.visualStyle = saved_style
                    if doc and target['id'] not in existing_ids:
                        doc.close(False)
                    write_json('status.json', result)
                adsk.doEvents()
            if original and original.isValid:
                original.activate()
            result.pop('current', None)
            write_json('capture-manifest.json', result)
        elif config['mode'] == 'organize':
            result.pop('projects', None)
            result['actions'] = []
            destination = personal[0].rootFolder.dataFolders.itemByName('WTC')
            if not destination:
                destination = personal[0].rootFolder.dataFolders.add('WTC')
            if not destination:
                raise RuntimeError('Could not create Personal/WTC')
            result['destination'] = {'name': destination.name, 'id': destination.id}
            write_json('status.json', result)
            desk = fun[0].rootFolder.dataFolders.itemByName('Desk')
            for name in ['WTC_Mk0_Stand', 'WTC_Mk0', 'WTC_Mk1', 'WTC_Mk2']:
                source = [f for f in items(desk.dataFiles) if f.name == name]
                existing = [f for f in items(destination.dataFiles) if f.name == name]
                if existing and not source:
                    result['actions'].append({'file':name, 'action':'already in destination'})
                elif len(source) == 1 and not existing:
                    action = {'file':name, 'action':'move', 'id':source[0].id}
                    try:
                        action['success'] = bool(source[0].move(destination))
                    except Exception:
                        action['success'] = False
                        action['error'] = traceback.format_exc()
                    result['actions'].append(action)
                else:
                    result['actions'].append({'file':name, 'action':'move', 'success':False,
                                              'error':'Source or destination name was ambiguous'})
                write_json('status.json', result)
                adsk.doEvents()
            coffee = [f for f in items(desk.dataFiles) if f.name == 'Model_CoffeeFilter']
            existing = [f for f in items(destination.dataFiles) if f.name == 'Model_CoffeeFilter']
            if len(existing) == 1:
                result['actions'].append({'file':'Model_CoffeeFilter', 'action':'already in destination'})
            elif len(coffee) == 1 and not existing:
                copied = coffee[0].copy(destination)
                result['actions'].append({'file':'Model_CoffeeFilter', 'action':'copy reference',
                                          'success': bool(copied), 'id':copied.id if copied else None})
            write_json('status.json', result)
            result['verified_destination'] = folder_record(destination, 'Personal/WTC')
            result['verified_source'] = folder_record(desk, 'Fun/Desk')
            if app.activeDocument.name.startswith('WallMount'):
                camera = app.activeViewport.camera
                try:
                    image(app, os.path.join(OUT, 'Fun', 'WallMount', 'WallMount_Right.png'),
                          adsk.core.ViewOrientations.RightViewOrientation)
                finally:
                    app.activeViewport.camera = camera
                    app.activeViewport.refresh()
        result['status'] = 'complete'
    except Exception:
        result['status'] = 'failed'
        result['error'] = traceback.format_exc()
    write_json('status.json', result)
