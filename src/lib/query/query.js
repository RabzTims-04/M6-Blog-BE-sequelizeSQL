import sequelize from "sequelize";
const { Op } = sequelize;

export const queryFilter = (query) => {
    const filters = [];

    const keys = Object.keys(query);
    keys.forEach((key) => {
      let element;
      if (key === "age") {
        element = { [key]: { [Op.eq]: parseInt(query[key]) } };
      } else {
        element = { [key]: { [Op.iLike]: `%${query[key]}%` } };
      }
   
      filters.push(element);
    });
    return filters
}

