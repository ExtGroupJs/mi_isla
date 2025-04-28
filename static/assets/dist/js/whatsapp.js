const STORE_PHONE = "17868936390"; // Sin '+' para compatibilidad
      

// Función para contactar por WhatsApp
function contactWhatsApp(productName, price) {
        // Formatear el mensaje
    const message = `Hola, estoy interesado en el producto: ${productName} - Precio: $${price}`;
    const encodedMessage = encodeURIComponent(message);
  
    // Detectar si es dispositivo móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    // Crear el enlace de WhatsApp según el dispositivo
    const whatsappUrl = isMobile
      ? `whatsapp://send?phone=${STORE_PHONE}&text=${encodedMessage}` // Enlace para app móvil
      : `https://wa.me/${STORE_PHONE}?text=${encodedMessage}`; // Enlace para web
  
    // Abrir WhatsApp
    window.location.href = whatsappUrl;
  }
  


  function sendWhatsAppMessage() {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
      // 1. Construir mensaje (mejorado)
      let message = "🛒 *Pedido desde la web*:\n\n";
      cart.forEach((product) => {
        message += `➡ ${product.name}\n• Precio: $${product.sell_price.toFixed(2)}\n• Cantidad: ${product.quantity}\n\n`;
      });
  
      // 2. Añadir totales (con verificación)
      const subtotal = document.getElementById("cart-subtotal")?.textContent || "No calculado";
      const total = document.getElementById("cart-total")?.textContent || "No calculado";
      message += `\n💳 *Totales*\nSubtotal: ${subtotal}\nTotal (con envío): ${total}`;
  
      const encodedMessage = encodeURIComponent(message);
  
      // 3. Generar URLs alternativas
      const urls = {
        primary: `https://api.whatsapp.com/send?phone=${STORE_PHONE}&text=${encodedMessage}`,
        fallbackWeb: `https://web.whatsapp.com/send?phone=${STORE_PHONE}&text=${encodedMessage}`,
        business: `https://wa.me/${STORE_PHONE}?text=${encodedMessage}&app_absent=1`,
        intent: `intent://send?phone=${STORE_PHONE}&text=${encodedMessage}#Intent;scheme=smsto;package=com.whatsapp;end`
      };
  
      // 4. Lógica de envío inteligente
      if (isMobile) {
        // Intentar primero con el protocolo intent (Android)
        window.location.href = urls.intent;
        
        // Si falla, redirigir después de 500ms al método business
        setTimeout(() => {
          window.location.href = urls.business;
        }, 500);
      } else {
        // Para escritorio: intentar API primero
        window.open(urls.primary, '_blank');
        
        // Si está bloqueado, usar fallback
        setTimeout(() => {
          window.open(urls.fallbackWeb || urls.business, '_blank');
        }, 300);
      }
  
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("⚠️ Abre WhatsApp manualmente y pega este mensaje:\n\n" + message);
    }
  }
  