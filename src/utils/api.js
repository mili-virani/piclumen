import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LOGIN_ID = process.env.NEXT_PUBLIC_LOGIN_ID;

export async function getIamges(setLoading) {
    try {
        const response = await axios.get(`${API_URL}/get_photos`, {
            headers: { loginid: LOGIN_ID },
        });

        if (response.data && Array.isArray(response.data.photos)) {
            return response?.data?.photos || []; // Assuming response is an array of image URLs
        }
    } catch (error) {
        console.error("Error fetching images:", error);
    } finally {
        setLoading(false);
    }
}
export async function getUsers(setLoading) {
    try {
        const response = await axios.get(`${API_URL}/get_persons`, {
          headers: {
            loginid: LOGIN_ID
          }
        });
        return response.data.persons || []; // Ensure response structure matches expected data
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
}

export async function recognizeImage(formData) {


    try {
        const response = await axios.post(`${API_URL}/recognize`, formData, {
            headers: {
                "loginid": LOGIN_ID,
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data; // or response.text if backend returns plain text
    } catch (error) {
        console.error("Image recognition failed:", error);
        throw error;
    }
}

export async function removeDuplicates() {
    try {
        const response = await axios.post(
            `${API_URL}/remove_duplicates`,
            {}, // Empty body (since fetch had no body)
            {
                headers: {
                    loginid: LOGIN_ID,
                },
            }
        );

        return response.data; // Returning the response data
    } catch (error) {
        console.error("Error removing duplicates:", error);
        throw error;
    }
}

export async function getPersonGallery(personId) {
    try {
        const response = await axios.get(
            `${API_URL}/get_person_gallery?person_id=${personId}`,
            {
                headers: {
                    loginid: LOGIN_ID,
                },
            }
        );

        return response.data; // Returning response data
    } catch (error) {
        console.error("Error fetching person gallery:", error);
        throw error;
    }
}