export const objectLocalStorage = {
  saveObjectToLocalStorage(key: string, obj: object) {
    // Convert the object to a JSON string

    const jsonString = JSON.stringify(obj);

    // Store the JSON string in localStorage with the provided key
    localStorage.setItem('backoffice-' + key, jsonString);
  },

  getObjectFromLocalStorage(key: string) {
    // Get the JSON string from localStorage using the provided key

    const jsonString: string | null = localStorage.getItem('backoffice-' + key);
    if (jsonString === null) return null;

    // Parse the JSON string back to an object and return it
    return JSON.parse(jsonString);
  }
};
