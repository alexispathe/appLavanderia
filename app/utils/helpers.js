export function generateUniqueId() {
    // Genera un ID único basado en la fecha y un número aleatorio
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  }
  
  export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString();
  }
  