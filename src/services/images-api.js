export async function fetchImagesBundle({ query, page, perPage }) {
  const ACCESS_KEY = '27723162-12c5df9d8fe49465a0d14715c';
  const response = await fetch(
    `https://pixabay.com/api/?q=${query}&page=${page}&key=${ACCESS_KEY}&image_type=photo&orientation=horizontal&per_page=${perPage}`
  );
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(
    new Error(`There are no images, corresponding your request.`)
  );
}
