/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'files.edgestore.dev'
			},
			{
				protocol: 'https',
				hostname: 'api.dicebear.com'
			}
		]
	}
}

module.exports = nextConfig;
