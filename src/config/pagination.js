const { generateQueryString } = require("../core/utils/query");

const pagination = {
    totalItems: 0,
    limit: 10,
    page: 1,
    orderBy: 'dsc',
    sortBy: 'updatedAt',
    search: '',
    getPaginate: ({ total, limit, page, path = '', query = {} }) => {
        const totalPage = Math.ceil(total / limit);

        const payload = {
            page,
            limit,
            total,
            from: 1,
            to: totalPage,
            next: '',
            previous: '',
            links: [],
        };

        if (page < totalPage) {
            const queryStr = generateQueryString({ ...query, page: page + 1 });
            payload.next = `${path}?${queryStr}`;
        }

        if (page > 1) {
            const queryStr = generateQueryString({ ...query, page: page - 1 });
            payload.previous = `${path}?${queryStr}`;
        }

        for (let i = 1; i <= totalPage; i++) {
            payload.links.push(`${path}?${generateQueryString({ ...query, page: i })}`)
        }

        return payload;
    }
};

module.exports = Object.freeze(pagination);
