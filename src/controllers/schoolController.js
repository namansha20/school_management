const pool = require('../config/db');

/**
 * Calculate the distance between two geographic coordinates using the Haversine formula.
 * @param {number} lat1 - Latitude of point 1 in degrees
 * @param {number} lon1 - Longitude of point 1 in degrees
 * @param {number} lat2 - Latitude of point 2 in degrees
 * @param {number} lon2 - Longitude of point 2 in degrees
 * @returns {number} Distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * POST /addSchool
 * Adds a new school to the database.
 */
async function addSchool(req, res) {
    const { name, address, latitude, longitude } = req.body;

    // Validate required fields
    if (!name || !address || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required: name, address, latitude, longitude'
        });
    }

    // Validate field types
    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'name must be a non-empty string'
        });
    }

    if (typeof address !== 'string' || address.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'address must be a non-empty string'
        });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({
            success: false,
            message: 'latitude must be a valid number between -90 and 90'
        });
    }

    if (isNaN(lon) || lon < -180 || lon > 180) {
        return res.status(400).json({
            success: false,
            message: 'longitude must be a valid number between -180 and 180'
        });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name.trim(), address.trim(), lat, lon]
        );

        return res.status(201).json({
            success: true,
            message: 'School added successfully',
            data: {
                id: result.insertId,
                name: name.trim(),
                address: address.trim(),
                latitude: lat,
                longitude: lon
            }
        });
    } catch (error) {
        console.error('Error adding school:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

/**
 * GET /listSchools
 * Returns all schools sorted by proximity to the given coordinates.
 */
async function listSchools(req, res) {
    const { latitude, longitude } = req.query;

    // Validate query parameters
    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            success: false,
            message: 'latitude and longitude query parameters are required'
        });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    if (isNaN(userLat) || userLat < -90 || userLat > 90) {
        return res.status(400).json({
            success: false,
            message: 'latitude must be a valid number between -90 and 90'
        });
    }

    if (isNaN(userLon) || userLon < -180 || userLon > 180) {
        return res.status(400).json({
            success: false,
            message: 'longitude must be a valid number between -180 and 180'
        });
    }

    try {
        const [schools] = await pool.execute('SELECT * FROM schools');

        const schoolsWithDistance = schools.map((school) => ({
            ...school,
            distance: haversineDistance(userLat, userLon, school.latitude, school.longitude)
        }));

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        return res.status(200).json({
            success: true,
            message: 'Schools retrieved successfully',
            data: schoolsWithDistance
        });
    } catch (error) {
        console.error('Error fetching schools:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = { addSchool, listSchools };
