import {
  JOURNAL_QUERY,
  PAGE_QUERY,
  SITECONFIG_GRAPHQL_FIELDS,
  SITEINFO_GRAPHQL_FIELDS,
} from "./queries"

async function fetchGraphQL(
  query: string,
  preview: boolean = false,
  tags?: string[]
) {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const token = preview
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN

  // ⛔ Contentful not configured → return empty data instead of crashing
  if (!spaceId || !token) {
    return {
      data: {
        b2CPageCollection: { items: [] },
        journalCollection: { items: [] },
        siteConfig: null,
      },
    }
  }

  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
      next: { tags },
    }
  ).then((response) => response.json())
}


function extractPageEntries(res: {
  data: { b2CPageCollection: { items: any[] } }
}) {
  return res?.data?.b2CPageCollection?.items
}

function extractJournalEntries(res: {
  data: { journalCollection: { items: any[] } }
}) {
  return res?.data?.journalCollection?.items
}

export async function getAllPages(isDraftMode: boolean = false) {
  const pages = await fetchGraphQL(
    `query {
          b2CPageCollection(where:{slug_exists: true}, order: title_DESC, limit: 100, preview: ${
            isDraftMode ? "true" : "false"
          }) {
            items {
              sys {
                id
              }
              title
              slug
            }
          }
        }`,
    isDraftMode,
    ["pages"]
  )

  return extractPageEntries(pages)
}

export async function getPage(slug: string, isDraftMode: boolean = false) {
  const page = await fetchGraphQL(
    `query {
          b2CPageCollection(where:{slug: "${slug}"}, limit: 1, preview: ${
            isDraftMode ? "true" : "false"
          }) {
            items {
              ${PAGE_QUERY}
            }
          }
        }`,
    isDraftMode,
    [`page_${slug}`]
  )

  const entries = extractPageEntries(page)
return entries?.[0] ?? null

}

export async function getAllJournalPosts(isDraftMode: boolean = false) {
  const posts = await fetchGraphQL(
    `query {
          journalCollection(where:{slug_exists: true}, limit: 100, preview: ${
            isDraftMode ? "true" : "false"
          }) {
            items {
              sys {
                id
              }
              title
              slug
            }
          }
        }`,
    isDraftMode,
    ["journalPosts"]
  )

  return extractJournalEntries(posts)
}

export async function getJournal(slug: string, isDraftMode: boolean = false) {
  const post = await fetchGraphQL(
    `query {
          journalCollection(where:{slug: "${slug}"}, limit: 1, preview: ${
            isDraftMode ? "true" : "false"
          }) {
            items {
              ${JOURNAL_QUERY}
            }
          }
        }`,
    isDraftMode,
    [`journal_${slug}`]
  )

  const entries = extractJournalEntries(post)
return entries?.[0] ?? null

}

export async function getSiteConfig(id: string, isDraftMode = false) {
  const res = await fetchGraphQL(
    `query {
       siteConfig(id: "${id}", preview: ${isDraftMode ? "true" : "false"}) {
            ${SITECONFIG_GRAPHQL_FIELDS}
        }
      }`,
    isDraftMode,
    ["siteConfig"]
  )

  return res.data.siteConfig
}

export async function getSiteInfo(id: string, isDraftMode = false) {
  const res = await fetchGraphQL(
    `query {
       siteConfig(id: "${id}", preview: ${
         isDraftMode ? "true" : "false"
       }, limit: 1) {
            ${SITEINFO_GRAPHQL_FIELDS}
        }
      }`,
    isDraftMode,
    ["siteConfig"]
  )

  return res.data.siteConfig
}
