const pagination = require('../../config/pagination');

const getPaginateQueryParams = (payload) => {
    const page = payload.page || pagination.page;
    const limit = payload.limit || pagination.limit;
    const orderBy = payload.order_by || pagination.orderBy;
    const sortBy = payload.sort_by || pagination.sortBy;
    const search = payload.search || pagination.search;
    return { page, limit, orderBy, sortBy, search };
}

const generateQueryString = (query) => {
    return Object.keys(query)
        .map(
            (key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
        )
        .join('&');
};


const getTransformedItems = ({ items = [], selection = [] }) => {
    if (!Array.isArray(items) || !Array.isArray(selection)) {
        throw new Error('Invalid selection');
    }

    if (selection.length === 0) {
        return items;
    }

    return items.map((item) => {
        const result = {};
        selection.forEach((key) => {
            result[key] = item[key];
        });
        return result;
    });
};

const getTransformedItem = ({ item, selection = [] }) => {
    if (!item) {
        throw new Error('Invalid selection');
    }

    if (selection.length === 0) {
        return item;
    }

    const result = {};
    selection.forEach((key) => {
        result[key] = item[key];
    });
    return result;
};

module.exports = {
    getPaginateQueryParams,
    generateQueryString,
    getTransformedItems,
    getTransformedItem,
};
