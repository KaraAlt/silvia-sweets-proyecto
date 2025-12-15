# 🛒 Silvia Sweets - Proyecto Final E-commerce

Este proyecto es una aplicación web tipo E-commerce desarrollada como entrega final para el curso de **Desarrollo Web Frontend**. Simula una tienda online de productos orgánicos y postres saludables ("Silvia Sweets"), combinando un diseño responsivo con lógica de programación en JavaScript.

## 🚀 Funcionalidades Principales

* **Catálogo Dinámico:** Los productos se cargan automáticamente consumiendo una **API REST externa** (MockAPI), permitiendo actualizaciones en tiempo real sin tocar el HTML.
* **Carrito de Compras Inteligente:**
    * Permite agregar productos, sumar/restar cantidades y eliminar ítems.
    * Calcula el precio total automáticamente.
    * **Persistencia de Datos:** El carrito queda guardado en el navegador (LocalStorage) aunque se recargue la página.
* **Checkout Simulado:** Genera un resumen del pedido y abre el cliente de correo predeterminado para finalizar la compra.
* **Formulario de Contacto:** Funcional e integrado con **Formspree** para la recepción de mensajes.
* **Diseño Responsivo:** Adaptado completamente a dispositivos móviles (Mobile First) y escritorio utilizando CSS Flexbox y Grid.

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica y accesible.
* **CSS3:** Variables CSS, Flexbox, Grid Layout y Media Queries.
* **JavaScript (ES6+):**
    * `fetch()` con `async/await` para consumo de API.
    * Manipulación del DOM.
    * Manejo de Eventos.
    * Lógica de LocalStorage y JSON.

## 📦 Instalación y Uso

1.  Clonar el repositorio o descargar los archivos.
2.  Abrir el archivo `index.html` en cualquier navegador moderno.
3.  ¡Listo! No requiere instalación de dependencias adicionales.

---
**Autor:** Laura Alarcon, Priscila Karim
**Curso:** Talento Tech - Desarrollo Web