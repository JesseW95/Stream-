import {useEffect, useState} from 'react'
import axios from 'axios'
export default function useEmoteSearch(query, url, skip, ){
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [emotes, setEmotes] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [emoteCount, setEmoteCount] = useState(0)

    useEffect(() => {
        setEmotes([])
    }, [query])

    useEffect( () => {
        setLoading(true)
        setError(false)
        let cancel
        axios({
            method: 'GET',
            url: url, //change to a REST get method returning a list of all emotes
            params: {search: query, skip:skip, limit: 25},
            cancelToken: new axios.CancelToken(c => cancel = c) //cancel search while typing
        }).then(res => {
            setEmotes(prevEmotes => {
               return !res.data ? "" : [...new Set([...prevEmotes, ...res.data.map(b => b)])] //Set removes duplicates
            })//also checks if the data is null and doesn't return anything if it is.
            setEmoteCount(res.data.length)
            setHasMore(res.data.length > 0)
            setLoading(false)
        }).catch(e => {
            if(axios.isCancel(e)) return //ignore cancel errors from cancel tokens.
            setError(true)
        })
        return () => cancel()
    }, [query, url, skip])

    return {loading, error, emotes, hasMore, emoteCount}
}