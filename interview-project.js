/* Activity Connection Interview Project */

(async () => {
  // Fetch the content map from the static URL
  const url = 'https://interview.actcon.info/static/content_map.json';
  const contentMapResponse = await fetch(url);
  // Parse the JSON response
  const contentMap = await contentMapResponse.json();
})();
