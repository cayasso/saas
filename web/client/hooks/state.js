import useSWR from 'swr'

export const useSharedState = (key, value) => {
  const { data: state, mutate: setState } = useSWR(key, {
    fallbackData: value,
    fetcher: null,
  })

  return [state, setState]
}
