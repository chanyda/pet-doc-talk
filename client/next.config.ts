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
        remotePatterns: [
            {
                protocol: "https",
                hostname: "d25h8ttszcbdyj.cloudfront.net",
            },
        ],
    },
};
