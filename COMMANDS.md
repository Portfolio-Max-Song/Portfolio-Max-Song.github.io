# Local Development Commands

Quick reference for running and stopping the local development server for this portfolio project.

---

## 1. Start the Server

Run this command in the terminal from the project root:

```bash
npm run dev
```

> Once running, open your browser and navigate to:  
> **[http://localhost:4321/](http://localhost:4321/)**

*(Alternative: `npm start` or `npx astro dev`)*

---

## 2. Stop / Close the Server

### Normal Way (Interactive Terminal)
If the server is running in your active terminal:
1. Click into the terminal window.
2. Press **`Ctrl` + `C`**.
3. If prompted with `Terminate batch job (Y/N)?`, type **`y`** and press **`Enter`**.

---

### If Running in the Background (or Port 4321 is Busy)

If the server was started in the background or the terminal was closed without stopping it:

#### Windows PowerShell:
```powershell
# Stop any process listening on port 4321
Stop-Process -Id (Get-NetTCPConnection -LocalPort 4321).OwningProcess -Force
```

#### Windows Command Prompt (CMD):
```cmd
# 1. Find the Process ID (PID) in the right-most column
netstat -ano | findstr :4321

# 2. Terminate the process (replace <PID> with the actual number)
taskkill /PID <PID> /F
```

---

## Additional Useful Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Astro dev server with hot reload |
| `npm run build` | Builds production site to `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run check` | Runs Astro diagnostic type/syntax check |
| `npm run optimize-images` | Runs the project image optimization script |
