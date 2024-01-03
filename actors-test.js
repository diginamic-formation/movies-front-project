const urlAppActors = "http://localhost:8080/persons/all";
const API_KEY = "8c876ad71559ac44edf7af86b9d77927";

const pageSize = 12;
let totalPageCount = 332; // Nombre total de pages
let currentPage = 0;

async function getActors(pageNumber) {
  console.log("I am being called");
  try {
    const response = await fetch(`${urlAppActors}?page=${1}&size=${pageSize}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching actors:", error);
    throw error;
  }
}

console.log(getActors(1));
