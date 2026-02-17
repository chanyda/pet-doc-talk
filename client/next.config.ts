module.exports = {
    turbopack: {
        rules: {
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.js",
            },
        },
    },
    images: {
        domains: ["d25h8ttszcbdyj.cloudfront.net"], // TODO: domain생기면 변경 필요
    },
};
