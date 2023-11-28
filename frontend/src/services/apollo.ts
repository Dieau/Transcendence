import { HttpLink, split } from "@apollo/client/core"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions" // <-- This one uses graphql-ws
import { getMainDefinition } from "@apollo/client/utilities"
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { createClient } from "graphql-ws"
import type { App } from "vue"
import { DefaultApolloClient } from "@vue/apollo-composable"

// Create an http link:
const httpLink = new HttpLink({
  uri: `http://localhost:3000/graphql`
})

// Create a GraphQLWsLink link:
const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://localhost:3000/subscription`
  })
)

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === `OperationDefinition` &&
      definition.operation === `subscription`
    )
  },
  wsLink,
  httpLink
)

export const cache = new InMemoryCache()

// Create the apollo client with cache implementation.
export const apolloClient = new ApolloClient({
  link,
  cache
})

// Install apollo client
export const apollo = {
  install(app: App) {
    app.provide(DefaultApolloClient, apolloClient)
  },
}