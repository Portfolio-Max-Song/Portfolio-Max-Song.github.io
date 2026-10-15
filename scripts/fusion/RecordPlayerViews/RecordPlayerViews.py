"""Capture exterior and uncovered record-player views without saving the design."""
import adsk.core
import adsk.fusion
import json
import os
from pathlib import Path
import traceback


def collection_items(collection):
    return [collection.item(index) for index in range(collection.count)]


def write_status(folder, status):
    folder.mkdir(parents=True, exist_ok=True)
    temporary = folder / 'status.tmp.json'
    temporary.write_text(json.dumps(status, indent=2), encoding='utf-8')
    os.replace(str(temporary), str(folder / 'status.json'))


def set_temporarily(entity, name, value, saved):
    previous = getattr(entity, name)
    if previous != value:
        saved.append((entity, name, previous))
        setattr(entity, name, value)


def fit_camera(app, orientation):
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


def capture(app, folder, name, orientation):
    fit_camera(app, orientation)
    options = adsk.core.SaveImageFileOptions.create(str(folder / name))
    options.width = 2400
    options.height = 1600
    options.isAntiAliased = True
    options.isBackgroundTransparent = True
    if not app.activeViewport.saveAsImageFileWithOptions(options):
        raise RuntimeError('Fusion could not export ' + name)


def run(context):
    app = adsk.core.Application.get()
    ui = app.userInterface
    settings_path = Path(__file__).with_name('settings.json')
    settings = json.loads(settings_path.read_text(encoding='utf-8'))
    output = Path(settings['output_folder'])
    result = {'status': 'running', 'images': [], 'hidden_parts': []}
    write_status(output, result)
    original_document = app.activeDocument
    original_camera = app.activeViewport.camera if original_document else None
    original_style = app.activeViewport.visualStyle if original_document else None
    temporary_document = None
    close_capture_document = True
    capture_camera = None
    capture_style = None
    saved = []
    try:
        source = Path(settings['source_model'])
        if not source.is_file():
            raise RuntimeError('The cached record-player model was not found: ' + str(source))
        options = app.importManager.createFusionArchiveImportOptions(str(source))
        try:
            temporary_document = app.importManager.importToNewDocument(options)
        except RuntimeError:
            # Referenced assemblies must be opened through Fusion's cloud file.
            file_id = settings.get('source_file_id')
            if not file_id:
                raise
            data_file = app.data.findFileById(file_id)
            if not data_file:
                raise RuntimeError('The record-player cloud design was not found.')
            existing = next((doc for doc in collection_items(app.documents)
                             if doc.dataFile and doc.dataFile.id == data_file.id), None)
            temporary_document = existing or app.documents.open(data_file, True)
            close_capture_document = existing is None
        if not temporary_document:
            raise RuntimeError('Fusion could not open a temporary copy of the model.')
        temporary_document.activate()
        capture_camera = app.activeViewport.camera
        capture_style = app.activeViewport.visualStyle
        design = adsk.fusion.Design.cast(app.activeProduct)
        if not design:
            raise RuntimeError('The imported document is not a Fusion design.')
        root = design.rootComponent
        components = collection_items(design.allComponents)
        for owner in [design, root] + components:
            analyses = getattr(owner, 'analyses', None)
            if analyses:
                for analysis in collection_items(analyses.sectionAnalyses):
                    set_temporarily(analysis, 'isLightBulbOn', False, saved)
                set_temporarily(analyses, 'isLightBulbOn', False, saved)
        for component in components:
            for property_name in ['isSketchFolderLightBulbOn', 'isConstructionFolderLightBulbOn', 'isOriginFolderLightBulbOn']:
                if hasattr(component, property_name):
                    set_temporarily(component, property_name, False, saved)
        app.activeViewport.visualStyle = adsk.core.VisualStyles.ShadedVisualStyle
        ui.activeSelections.clear()
        views = [
            ('isometric', adsk.core.ViewOrientations.IsoTopRightViewOrientation),
            ('top', adsk.core.ViewOrientations.TopViewOrientation),
            ('front', adsk.core.ViewOrientations.FrontViewOrientation),
        ]
        for label, orientation in views:
            name = 'closed-' + label + '.png'
            capture(app, output, name, orientation)
            result['images'].append(name)
            write_status(output, result)
        fit_camera(app, adsk.core.ViewOrientations.TopViewOrientation)
        ui.messageBox(
            'Select the top cover, then the record, in the next two prompts.\n\n'
            'If the record is included in the top body, press Escape at the second prompt.\n\n'
            'Visibility will be restored after capture. The design will not be saved.',
            'Record Player Gallery Views'
        )
        for part in ['top cover', 'record']:
            result['status'] = 'selecting ' + part
            write_status(output, result)
            try:
                selection = ui.selectEntity('Select the ' + part + ' body or component to hide', 'Bodies,Occurrences')
            except RuntimeError:
                if part == 'record':
                    break
                raise
            entity = selection.entity
            native = getattr(entity, 'nativeObject', None)
            entity = native if native else entity
            if not hasattr(entity, 'isLightBulbOn'):
                raise RuntimeError('The selected ' + part + ' cannot be hidden. Select a body or component.')
            result['hidden_parts'].append({'part': part, 'name': entity.name})
            set_temporarily(entity, 'isLightBulbOn', False, saved)
            ui.activeSelections.clear()
            app.activeViewport.refresh()
            adsk.doEvents()
        result['status'] = 'exporting internals'
        write_status(output, result)
        for label, orientation in views:
            name = 'internals-' + label + '.png'
            capture(app, output, name, orientation)
            result['images'].append(name)
            write_status(output, result)
        result['status'] = 'complete'
        write_status(output, result)
        ui.messageBox(
            'Exported three clean exterior views and three uncovered interior views.\n\n'
            'Return to the Codex chat and say the export is finished so the images can be checked and added to the gallery.',
            'Record Player Gallery Views'
        )
    except Exception:
        result['status'] = 'failed'
        result['error'] = traceback.format_exc()
        write_status(output, result)
        ui.messageBox('The export did not finish. Details were saved to:\n' + str(output / 'status.json'), 'Record Player Gallery Views')
    finally:
        for entity, name, value in reversed(saved):
            try:
                setattr(entity, name, value)
            except Exception:
                pass
        if temporary_document and temporary_document.isValid:
            if close_capture_document:
                temporary_document.close(False)
            else:
                temporary_document.activate()
                if capture_camera:
                    app.activeViewport.camera = capture_camera
                if capture_style is not None:
                    app.activeViewport.visualStyle = capture_style
        if original_document and original_document.isValid:
            original_document.activate()
            if original_camera:
                app.activeViewport.camera = original_camera
            if original_style is not None:
                app.activeViewport.visualStyle = original_style
            app.activeViewport.refresh()
