export function sanitizeURL(url: string): string {
   // regex from stackoverflow from another source
   const regexURL =
      /^(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/;
   url = url.trim();
   if (/^http:\/\//.test(url)) {
      url = url.replace('http://', 'https://');
   }
   if (regexURL.test(url)) {
      return url;
   }
   throw new Error('Invalid URL');
}

export function sanitizeBeatSaverID(id: string): string {
   const regexID = /^[0-9a-fA-F]{1,6}$/;
   id = id.trim();
   if (/^!bsr /.test(id)) {
      id = id.replace('!bsr ', '');
   }
   if (regexID.test(id)) {
      return id;
   }
   throw new Error('Invalid ID');
}

export function removeOptions(selectElement: HTMLSelectElement): void {
   for (let i = selectElement.options.length - 1; i >= 0; i--) {
      selectElement.remove(i);
   }
}
