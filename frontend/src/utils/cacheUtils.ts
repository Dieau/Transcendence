import { cache } from "@/services/apollo"
import type { UseQueryReturn } from '@vue/apollo-composable'
import type { OperationVariables } from '@apollo/client/core'
import type { DocumentNode } from "graphql"

interface IEvicCacheOption {
  id?: string
  __typename?: string
}

const releaseCache = ( { id, __typename}: IEvicCacheOption, broadcast: boolean) => {
    const rootId = cache.identify({ id, __typename })
    if (rootId) {
      cache.evict({id: rootId, broadcast})
    }
  }

export const cacheDelete = (arg?: IEvicCacheOption | IEvicCacheOption[]) =>  {
    if (!arg) return
    const tmpArr = Array.isArray(arg)? arg: [arg]
    const tmpArrLength = tmpArr.length
    for (let i = 0; i < tmpArrLength; i++) 
      releaseCache(tmpArr[i], i === tmpArrLength - 1)
    cache.gc()
  }
  
  const cacheCreate = <Q, V extends OperationVariables>(args?: UseQueryReturn<Q, V> | null, data?: any | any[]) =>  {
    if (!args || !data) return
    const document = args.document.value as DocumentNode
    const variables = args.variables.value
    const datas = cache.readQuery({ query: document, variables: variables }) as any
    const keyQuery = Object.keys(datas)[0]
    const newArray = datas? [...datas[keyQuery]]: []
    Array.isArray(data)? newArray.push(...data) :newArray.push(data)
    cache.updateQuery({query: document, variables: variables}, () => ({
      [keyQuery]: newArray
    }))
  }
  
  export const cacheUpsert = <Q, V extends OperationVariables>(args?: UseQueryReturn<Q, V> | null, data?: any | any[]) =>  {
    cacheDelete(data)
    cacheCreate(args, data)
  }