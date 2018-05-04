module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-cockpit',
      options: {
        cockpitConfig: {
          baseURL: 'https://wcmback.000webhostapp.com',
          accessToken: 'e55a80248f78b46edf0bf6e07d41fa',
        }
      }
    }
  ],
}
