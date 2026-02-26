export const GRID_CONTENT = `
  width
  height
  start
  title
  subtitle
  image {
    url
    width
    height
  }
  target {
    label
    destination
  }
`

export const PAGE_QUERY = `
  sys {
    id
  }
  title
  slug
  featuredImage {
    url
    width
    height
  }
  contentCollection(limit: 15) {
    items {
      __typename
      ...on GridRow {
        blocksCollection(limit: 24) {
          items {
            ...on GridItem {
              ${GRID_CONTENT}
            }
          }
        }
      }
      ... on PageHero {
        title
        excerpt
        image {
          url
          width
          height
        }
      }
      ... on Text {
        content {
          json
        }
      }
      ...on Image {
        altText
        image {
          url
          width
          height
        }
        target {
          label
          destination
        }
      }
    }
  }
`

export const JOURNAL_QUERY = `
  sys {
    id
  }
  title
  slug
  excerpt
  author
  featuredImage {
    url
    width
    height
  }
  contentCollection(limit: 15) {
    items {
      __typename
      ...on GridRow {
        blocksCollection(limit: 24) {
          items {
            ...on GridItem {
              ${GRID_CONTENT}
            }
          }
        }
      }
      ... on Text {
        content {
          json
        }
      }
      ...on Image {
        altText
        image {
          url
          width
          height
        }
        target {
          label
          destination
        }
      }
    }
  }
`

export const SITECONFIG_GRAPHQL_FIELDS = `
sys {
  id
}
brandName
logo {
  url
  width
  height
}
copyrightText
facebookLink
instagramLink
youTubeLink
headerNavigation {
  navigationItemsCollection(limit: 8) {
    items {
      ... on NavigationItem {
        sys {
          id
        }
        title
        link
        subItemsCollection(limit: 4) {
          items {
            ... on NavigationItem {
              sys {
                id
              }
              title
              link
            }
          }
        }
      }
    }
  }
}
footerSectionsCollection(limit: 4) {
  items {
    internalName
    navigationItemsCollection(limit: 8) {
      items {
        ... on NavigationItem {
          sys {
            id
          }
          title
          link
        }
      }
    }
  }
}
`

export const SITEINFO_GRAPHQL_FIELDS = `
sys {
  id
}
brandName
logo {
  url
  width
  height
}
`
