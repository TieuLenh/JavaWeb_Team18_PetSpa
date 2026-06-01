import { petMock } from "../assets/data/mocks/pet/petMock.js";
import { petDetailMock } from "../assets/data/mocks/pet/petDetailMock.js";
import { speciesMock } from "../assets/data/mocks/pet/speciesMock.js";

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
|--------------------------------------------------------------------------
| GET PETS
|--------------------------------------------------------------------------
*/

// Lấy tất cả thú cưng
const getPets = async () => {
  await delay(500);

  return petMock;
};

// Lấy thú cưng theo user
const getPetsByUser = async (userId) => {
  await delay(500);

  return {
    success: true,

    message: "Get user pets successfully",

    data: petMock.data.filter(
      (pet) => pet.owner.id === Number(userId)
    ),
  };
};

// Lấy chi tiết thú cưng
const getPetById = async (petId) => {
  await delay(500);

  return {
    success: true,

    message: "Get pet detail successfully",

    data:
      petDetailMock.data.id === Number(petId)
        ? petDetailMock.data
        : null,
  };
};

/*
|--------------------------------------------------------------------------
| SPECIES
|--------------------------------------------------------------------------
*/

// Lấy danh sách species
const getSpecies = async () => {
  await delay(300);

  return speciesMock;
};

/*
|--------------------------------------------------------------------------
| CREATE PET
|--------------------------------------------------------------------------
*/

// Tạo thú cưng mới
const createPet = async (petData) => {
  await delay(800);
  
  const newPet = {
    id: Date.now(),
    thumbnail: petData.thumbnail,
    name: petData.name,
    species: petData.species,
    breed: petData.breed,
    gender: petData.gender,
    age: petData.age,
    weight_kg: petData.weight_kg,
    status: "ACTIVE"
  };

  // Mẹo: Đẩy trực tiếp vào mảng mock đang lưu trong bộ nhớ RAM của trình duyệt
  petMock.data.push(newPet); 

  return { success: true, data: newPet };
};

/*
|--------------------------------------------------------------------------
| UPDATE PET
|--------------------------------------------------------------------------
*/

// Cập nhật thú cưng
const updatePet = async (petId, petData) => {
  await delay(700);

  return {
    success: true,

    message: "Update pet successfully",

    data: {
      id: petId,

      ...petData,

      updated_at: new Date().toISOString(),
    },
  };
};

/*
|--------------------------------------------------------------------------
| DELETE PET
|--------------------------------------------------------------------------
*/

// Xóa thú cưng
const deletePet = async (petId) => {
  await delay(500);

  return {
    success: true,

    message: `Delete pet #${petId} successfully`,
    data: null,
  };
};

export default {
  getPets,

  getPetsByUser,

  getPetById,

  getSpecies,

  createPet,

  updatePet,

  deletePet,
};