# 🛡️ VaeBridge - Guía de Seguridad

Este documento describe las medidas de seguridad implementadas en el sitio web de VaeBridge y las mejores prácticas para mantener el servidor seguro.

## 📋 Índice

1. [Medidas de Seguridad Implementadas](#medidas-de-seguridad-implementadas)
2. [Configuración de LiteBans](#configuración-de-litebans)
3. [Mejores Prácticas](#mejores-prácticas)
4. [Mantenimiento](#mantenimiento)

---

## 🔒 Medidas de Seguridad Implementadas

### 1. Content Security Policy (CSP)

Todas las páginas incluyen encabezados CSP que restringen:
- Ejecución de scripts solo desde el mismo origen (`'self'`)
- Carga de estilos solo desde fuentes confiables (Google Fonts)
- Conexiones solo a APIs autorizadas (Formspree)
- Imágenes desde fuentes seguras (HTTPS)

**Ejemplo en index.html:**
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ...">
```

### 2. Protección contra XSS (Cross-Site Scripting)

**Implementación en script.js:**
```javascript
function sanitizeInput(input) {
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
        .replace(/<embed\b[^<]*>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
}
```

Todos los inputs y textareas son sanitizados automáticamente en tiempo real.

### 3. Validación de Formularios

- **Validación HTML5:** Uso de atributos `required`, `maxlength`, y `type="email"`
- **Validación en el cliente:** Scripts que previenen la inyección de código
- **Validación en el servidor:** Formspree maneja la validación adicional

### 4. Protección de Enlaces Externos

Todos los enlaces externos incluyen:
```html
<a href="..." target="_blank" rel="noopener noreferrer">
```

Esto previene:
- **Tabnabbing:** `rel="noopener"`
- **Exposición de referrer:** `rel="noreferrer"`

### 5. Seguridad en LiteBans

El sistema LiteBans está integrado mediante iframe con restricciones de seguridad:
- Carga lazy para mejorar el rendimiento
- Sandbox implícito del navegador
- Acceso solo desde el mismo origen

---

## ⚙️ Configuración de LiteBans

### Requisitos Previos

1. **Servidor MySQL/MariaDB:**
   - Usuario con permisos de lectura en las tablas de LiteBans
   - Contraseña segura (mínimo 16 caracteres)

2. **PHP 7.4 o superior:**
   - Extensiones requeridas: `mysqli`, `pdo_mysql`

### Configuración del Sistema

**Archivo: `litebans-php-master/inc/settings.php`**

```php
<?php
class Settings {
    public function __construct() {
        // Idioma de la interfaz
        $this->lang = 'es_ES.utf8'; // Cambiar a español

        // Configuración de base de datos
        $this->host = 'localhost';
        $this->port = 3306;
        $this->database = 'litebans';
        $this->username = 'TU_USUARIO';  // ⚠️ CAMBIAR
        $this->password = 'TU_PASSWORD'; // ⚠️ CAMBIAR
        $this->table_prefix = "litebans_";
        $this->driver = 'mysql';

        // Nombre del servidor
        $this->name = 'VaeBridge';
        $this->name_link = '../index.html';

        // Configuración de visualización
        $this->show_inactive_bans = true;
        $this->show_silent_bans = false;
        $this->timezone = "America/Mexico_City"; // ⚠️ Ajustar según tu zona

        // Límite de registros por página
        $this->limit_per_page = 20;
    }
}
```

### Pasos de Configuración

1. **Editar `settings.php`:**
   ```bash
   nano litebans-php-master/inc/settings.php
   ```

2. **Configurar credenciales de base de datos:**
   - Reemplazar `TU_USUARIO` y `TU_PASSWORD`
   - Verificar que el prefijo de tabla coincida con tu configuración de LiteBans

3. **Configurar permisos de archivos:**
   ```bash
   chmod 644 litebans-php-master/inc/settings.php
   chmod 755 litebans-php-master/
   ```

4. **Probar la conexión:**
   - Visitar: `http://tu-dominio/litebans-php-master/check.php`
   - Verificar que no hay errores de conexión

### Seguridad de la Base de Datos

**Crear usuario con permisos limitados:**
```sql
CREATE USER 'litebans_web'@'localhost' IDENTIFIED BY 'PASSWORD_SEGURO_AQUI';

GRANT SELECT ON litebans.litebans_bans TO 'litebans_web'@'localhost';
GRANT SELECT ON litebans.litebans_mutes TO 'litebans_web'@'localhost';
GRANT SELECT ON litebans.litebans_warnings TO 'litebans_web'@'localhost';
GRANT SELECT ON litebans.litebans_kicks TO 'litebans_web'@'localhost';
GRANT SELECT ON litebans.litebans_history TO 'litebans_web'@'localhost';

FLUSH PRIVILEGES;
```

**⚠️ IMPORTANTE:** El usuario debe tener **SOLO** permisos de `SELECT`, nunca `INSERT`, `UPDATE` o `DELETE`.

---

## ✅ Mejores Prácticas

### 1. Gestión de Contraseñas

- **Nunca** commits archivos con contraseñas en Git
- Usar variables de entorno cuando sea posible
- Cambiar contraseñas periódicamente (cada 90 días)
- Usar contraseñas únicas de al menos 16 caracteres

**Ejemplo de .gitignore:**
```
# Configuraciones sensibles
litebans-php-master/inc/settings.php
config.php
.env
```

### 2. HTTPS Obligatorio

Configurar redirección automática a HTTPS:

**En Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**En Nginx:**
```nginx
server {
    listen 80;
    server_name vaebridge.minecraft.best;
    return 301 https://$server_name$request_uri;
}
```

### 3. Actualizaciones Regulares

- **PHP:** Mantener actualizado a la última versión estable
- **LiteBans:** Actualizar el plugin cuando haya parches de seguridad
- **Dependencias:** Revisar mensualmente las librerías de frontend

### 4. Copias de Seguridad

**Backup de la base de datos (diario):**
```bash
#!/bin/bash
DATE=$(date +"%Y%m%d")
mysqldump -u root -p litebans > /backups/litebans_$DATE.sql
find /backups -name "litebans_*.sql" -mtime +7 -delete
```

**Backup del sitio web (semanal):**
```bash
tar -czf vaebridge_backup_$(date +%Y%m%d).tar.gz \
  --exclude='*.log' \
  --exclude='node_modules' \
  /ruta/a/VaeBridgeOficial-main/
```

### 5. Monitoreo de Seguridad

**Revisar logs regularmente:**
```bash
# Logs de Apache
tail -f /var/log/apache2/error.log

# Logs de PHP
tail -f /var/log/php_errors.log

# Buscar intentos de ataque
grep "POST" /var/log/apache2/access.log | grep -E "(script|eval|exec|system)"
```

---

## 🔧 Mantenimiento

### Checklist Semanal

- [ ] Revisar logs de errores
- [ ] Verificar que el sistema de baneos esté funcionando
- [ ] Probar el formulario de contacto
- [ ] Verificar certificado SSL (caducidad)

### Checklist Mensual

- [ ] Actualizar contraseñas de bases de datos
- [ ] Revisar y actualizar dependencias
- [ ] Realizar backup completo
- [ ] Auditar permisos de archivos
- [ ] Revisar Content Security Policy

### Checklist Trimestral

- [ ] Auditoría de seguridad completa
- [ ] Actualización de PHP/MySQL
- [ ] Revisión de logs de acceso completos
- [ ] Test de penetración básico

---

## 🚨 En Caso de Incidente de Seguridad

### Procedimiento de Respuesta

1. **Aislamiento Inmediato:**
   ```bash
   # Deshabilitar el sitio temporalmente
   echo "Mantenimiento en progreso" > index.html
   ```

2. **Análisis de Logs:**
   ```bash
   # Buscar actividad sospechosa
   grep -i "union\|select\|script" /var/log/apache2/access.log
   ```

3. **Cambio de Credenciales:**
   ```sql
   ALTER USER 'litebans_web'@'localhost' IDENTIFIED BY 'NUEVA_CONTRASEÑA_SEGURA';
   FLUSH PRIVILEGES;
   ```

4. **Restauración desde Backup:**
   ```bash
   # Restaurar base de datos
   mysql -u root -p litebans < /backups/litebans_20250101.sql

   # Restaurar archivos
   tar -xzf vaebridge_backup_20250101.tar.gz
   ```

5. **Notificación:**
   - Informar a los administradores
   - Actualizar a los usuarios si hay compromiso de datos

---

## 📞 Contactos de Emergencia

- **Discord del servidor:** https://discord.gg/fEYt2VMU
- **Email de soporte:** (configurar en Formspree)

---

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [LiteBans Documentation](https://gitlab.com/ruany/litebans-php/-/wikis/home)
- [PHP Security Best Practices](https://www.php.net/manual/en/security.php)

---

## ✨ Características de Seguridad del Diseño Actual

### Colorimetría y UX Seguro

El nuevo diseño futurista incluye:
- **Indicadores visuales claros** para acciones peligrosas (rojo)
- **Feedback inmediato** en formularios
- **Animaciones suaves** que no distraen de contenido crítico
- **Contraste suficiente** para accesibilidad (WCAG AA)

### Botón de Copiar IP

```javascript
function copyIP() {
    const ip = 'vaebridge.minecraft.best';
    navigator.clipboard.writeText(ip)
        .then(() => { /* Success */ })
        .catch((err) => { /* Error handling */ });
}
```

- Usa la API moderna del portapapeles
- Manejo de errores apropiado
- Feedback visual al usuario

---

**Última actualización:** 2025-11-06
**Versión:** 2.0.0
**Mantenido por:** Equipo VaeBridge
