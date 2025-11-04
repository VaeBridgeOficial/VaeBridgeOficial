# 🚀 Guía Completa: Subir tu Sitio a GitHub Pages

## 📋 Índice
1. [Preparación de Archivos](#1-preparación-de-archivos)
2. [Subir a GitHub](#2-subir-a-github)
3. [Configurar GitHub Pages](#3-configurar-github-pages)
4. [Conectar Base de Datos (Opcional)](#4-conectar-base-de-datos-opcional)
5. [Solución de Problemas](#5-solución-de-problemas)

---

## 1. Preparación de Archivos

### Paso 1.1: Abrir Terminal

1. Presiona `Windows + R`
2. Escribe `cmd` y presiona Enter
3. Navega a tu carpeta del proyecto:
   ```bash
   cd C:\Users\Isaac\IdeaProjects\VaeBridgeOficial-main
   ```

### Paso 1.2: Verificar que Git está instalado

```bash
git --version
```

Si no está instalado, descárgalo de: https://git-scm.com/downloads

---

## 2. Subir a GitHub

### Paso 2.1: Inicializar Git (si no lo has hecho)

```bash
git init
```

### Paso 2.2: Configurar tu usuario Git (solo la primera vez)

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tuemail@ejemplo.com"
```

### Paso 2.3: Conectar con tu repositorio de GitHub

```bash
git remote add origin https://github.com/VaeBridgeOficial/VaeBridgeOficial.git
```

Si ya existe, usa:
```bash
git remote set-url origin https://github.com/VaeBridgeOficial/VaeBridgeOficial.git
```

### Paso 2.4: Agregar todos los archivos

```bash
git add .
```

### Paso 2.5: Hacer commit

```bash
git commit -m "Sitio mejorado con diseño moderno, sistema de tiers LT/HT y página de tops"
```

### Paso 2.6: Subir a GitHub

```bash
git push -u origin main
```

**Si te da error**, intenta con:
```bash
git push -u origin master
```

### Paso 2.7: Autenticación

Si te pide usuario y contraseña:

1. **Usuario:** VaeBridgeOficial
2. **Contraseña:** NO uses tu contraseña normal, necesitas un **Personal Access Token**

#### Cómo crear un Personal Access Token:

1. Ve a: https://github.com/settings/tokens
2. Click en "Generate new token" → "Generate new token (classic)"
3. Nombre: "VaeBridge Website"
4. Selecciona: `repo` (todos los permisos de repositorio)
5. Click en "Generate token"
6. **COPIA EL TOKEN** (solo se muestra una vez)
7. Usa este token como contraseña cuando Git te lo pida

---

## 3. Configurar GitHub Pages

### Paso 3.1: Ir a la configuración del repositorio

1. Ve a: https://github.com/VaeBridgeOficial/VaeBridgeOficial
2. Click en **Settings** (arriba a la derecha)

### Paso 3.2: Activar GitHub Pages

1. En el menú izquierdo, click en **Pages**
2. En "Source", selecciona:
   - **Branch:** `main` (o `master`)
   - **Folder:** `/ (root)`
3. Click en **Save**

### Paso 3.3: Esperar a que se publique

1. GitHub mostrará un mensaje: "Your site is ready to be published at..."
2. Espera 1-2 minutos
3. Refresca la página
4. Verás: "Your site is live at https://vaebridgeoficial.github.io/VaeBridgeOficial/"

### Paso 3.4: Visitar tu sitio

Visita: https://vaebridgeoficial.github.io/VaeBridgeOficial/index.html

🎉 **¡Tu sitio está online!**

---

## 4. Conectar Base de Datos (Opcional)

⚠️ **IMPORTANTE:** GitHub Pages NO soporta PHP ni bases de datos directamente.

### Opción A: Usar datos estáticos (Ya configurado)

El sitio ya usa `data.json` con datos de ejemplo. **No necesitas hacer nada más.**

Para actualizar los datos:
1. Edita `data.json`
2. Haz commit y push a GitHub
3. Los cambios aparecerán en 1-2 minutos

### Opción B: Conectar con base de datos real

Necesitas un servidor con soporte PHP para el backend.

#### Paso 4B.1: Conseguir un hosting gratuito

Opciones recomendadas:

**InfinityFree (Recomendado - 100% Gratis)**
- Sitio: https://www.infinityfree.net/
- Registro: Click en "Sign Up"
- Soporta PHP y MySQL
- Sin anuncios

**000webhost**
- Sitio: https://www.000webhost.com/
- Soporta PHP y MySQL
- Puede tener anuncios

**Bloom.host (Si ya tienes hosting aquí)**
- Si tu base de datos está en Bloom.host, pregunta si tienes acceso web/FTP

#### Paso 4B.2: Subir archivos PHP al hosting

1. Descarga FileZilla: https://filezilla-project.org/
2. Conéctate a tu hosting con FTP
3. Sube **SOLO estos archivos**:
   ```
   📁 public_html/
   └── 📁 api/
       ├── players.php
       └── config.php
   ```

#### Paso 4B.3: Probar la API

Visita en tu navegador:
```
https://tudominio.infinityfreeapp.com/api/players.php
```

Deberías ver un JSON con los datos de los jugadores.

#### Paso 4B.4: Configurar el sitio para usar la API

1. Abre `config.js` en tu proyecto local
2. Encuentra esta línea:
   ```javascript
   dataSource: 'data.json',
   ```
3. Cámbiala por:
   ```javascript
   dataSource: 'https://tudominio.infinityfreeapp.com/api/players.php',
   ```
4. Guarda el archivo
5. Haz commit y push:
   ```bash
   git add config.js
   git commit -m "Conectar con API de base de datos"
   git push
   ```
6. Espera 1-2 minutos y visita tu sitio

🎉 **¡Ahora tu sitio muestra datos reales de la base de datos!**

---

## 5. Solución de Problemas

### ❌ Error: "Permission denied"

**Solución:**
```bash
git remote remove origin
git remote add origin https://github.com/VaeBridgeOficial/VaeBridgeOficial.git
git push -u origin main
```

### ❌ Error: "fatal: not a git repository"

**Solución:**
```bash
git init
git remote add origin https://github.com/VaeBridgeOficial/VaeBridgeOficial.git
git add .
git commit -m "Sitio actualizado"
git push -u origin main
```

### ❌ La página muestra 404 Not Found

**Soluciones:**

1. Verifica que el repositorio sea público:
   - Ve a: https://github.com/VaeBridgeOficial/VaeBridgeOficial/settings
   - Scroll hasta abajo
   - Si dice "Change visibility", el repo es privado
   - Click en "Change visibility" → "Make public"

2. Verifica la URL correcta:
   - La URL debe ser: `https://vaebridgeoficial.github.io/VaeBridgeOficial/index.html`
   - NOT: `https://github.com/VaeBridgeOficial/VaeBridgeOficial`

3. Espera más tiempo:
   - GitHub Pages puede tardar hasta 10 minutos en actualizar

### ❌ Los datos no se cargan (muestra "Cargando datos...")

**Soluciones:**

1. Verifica que `data.json` existe en GitHub
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que `config.js` y `script.js` estén en GitHub

### ❌ Error de CORS al conectar con la API

**Solución en el archivo PHP:**

Agrega al inicio de `api/players.php`:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
```

---

## 📝 Comandos Rápidos de Referencia

### Actualizar el sitio después de hacer cambios:

```bash
cd C:\Users\Isaac\IdeaProjects\VaeBridgeOficial-main
git add .
git commit -m "Descripción de los cambios"
git push
```

### Ver el estado actual:

```bash
git status
```

### Ver el historial de commits:

```bash
git log --oneline
```

### Deshacer cambios locales (antes de commit):

```bash
git restore .
```

---

## 🎯 Próximos Pasos

1. ✅ Subir el sitio a GitHub Pages
2. ✅ Verificar que funciona con datos estáticos
3. ⏳ (Opcional) Configurar hosting para PHP
4. ⏳ (Opcional) Conectar con base de datos real
5. ⏳ Personalizar `data.json` con tus jugadores reales
6. ⏳ Compartir el enlace con tu comunidad

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:

1. Revisa la sección "Solución de Problemas" arriba
2. Abre la consola del navegador (F12) y busca errores en rojo
3. Verifica que todos los archivos estén en GitHub
4. Espera unos minutos (GitHub Pages puede tardar)

---

## 🌐 Enlaces Útiles

- Tu sitio: https://vaebridgeoficial.github.io/VaeBridgeOficial/index.html
- Tu repositorio: https://github.com/VaeBridgeOficial/VaeBridgeOficial
- GitHub Pages docs: https://docs.github.com/es/pages
- Git tutorial: https://git-scm.com/book/es/v2

---

**¡Buena suerte! 🚀**
