import Hotel from "../models/Hotel.js";

export const getHotels = async (req, res) => {
  try {
    const { search, sort } = req.query;

    let query = {};

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

    let sortOption = {};

    if (sort === "price-low") {
      sortOption.price = 1;
    } else if (sort === "price-high") {
      sortOption.price = -1;
    } else if (sort === "rating") {
      sortOption.rating = -1;
    }

    const hotels = await Hotel.find(query).sort(sortOption);

    res.json({
      hotels
    });
  } catch (error) {
    console.error("Get Hotels Error:", error);

    res.status(500).json({
      message: "Failed to get hotels"
    });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    res.json({
      hotel
    });
  } catch (error) {
    console.error("Get Hotel Error:", error);

    res.status(500).json({
      message: "Failed to get hotel"
    });
  }
};