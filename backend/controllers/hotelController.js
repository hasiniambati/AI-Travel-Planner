import Hotel from "../models/Hotel.js";

// GET /api/hotels
// GET /api/hotels?search=Goa
// GET /api/hotels?sort=price-low

export const getHotels = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const sort = req.query.sort || "";

    let query = {};

    // Search by hotel name OR location
    if (search) {
      query = {
        $or: [
          {
            name: {
              $regex: search,
              $options: "i"
            }
          },
          {
            location: {
              $regex: search,
              $options: "i"
            }
          }
        ]
      };
    }

    // Sorting
    let sortOption = {};

    if (sort === "price-low") {
      sortOption = { price: 1 };
    }

    if (sort === "price-high") {
      sortOption = { price: -1 };
    }

    if (sort === "rating") {
      sortOption = { rating: -1 };
    }

    const hotels = await Hotel
      .find(query)
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: hotels.length,
      hotels
    });

  } catch (error) {
    console.error("GET HOTELS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get hotels"
    });
  }
};


// GET /api/hotels/:id

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    res.status(200).json({
      success: true,
      hotel
    });

  } catch (error) {
    console.error("GET HOTEL BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get hotel"
    });
  }
};