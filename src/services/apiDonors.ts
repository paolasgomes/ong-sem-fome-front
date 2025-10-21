
export const API_URL = "http://localhost:3000"; 

export async function createDonor(donorData: any) {
  const response = await fetch(`${API_URL}/donors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(donorData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao criar doador");
  }

  return response.json();
}
