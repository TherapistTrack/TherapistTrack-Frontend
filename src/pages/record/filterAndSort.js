// This component is made to imitate the data refining thats going to be happening in the backend
import { ref } from 'vue'

export const filterAndSort = () => {
  const filters = ref([])
  const sorts = ref([])

  // const applyFilters = () =>{
  //     console.log('filter application')
  // }
  // const applySorts = () =>{
  //     console.log('sort application')
  // }
  const refineData = (jsonData) => {
    // if (
    //     // both are unset,
    //     ((sortCriteria.value === undefined) | (sortCriteria.value.length === 0)) &
    //     ((filterCriteria.value === undefined) | (filterCriteria.value.length === 0))
    //   ) {
    //     // full reset of processed data
    //     processedData.value = convertToObject(fetchedData.value)
    //   } else if (
    //     // sorts are unset, only filters
    //     (sortCriteria.value === undefined) |
    //     (sortCriteria.value.length === 0)
    //   ) {
    //     processedData.value = convertToObject(fetchedData.value)
    //     processedData.value = filterJsonEntries(
    //       processedData.value,
    //       filterCriteria.value[0].name,
    //       filterCriteria.value[0].operation,
    //       filterCriteria.value[0].value
    //     )
    //   } else if (
    //     // filters are unset, only sorts
    //     (filterCriteria.value === undefined) |
    //     (filterCriteria.value.length === 0)
    //   ) {
    //     processedData.value = convertToObject(fetchedData.value)
    //     sortJsonEntries(processedData.value)
    //   } else {
    //     // Both are processed
    //     sortJsonEntries(processedData.value)
    //     processedData.value = filterJsonEntries(
    //       processedData.value,
    //       filterCriteria.value[0].name,
    //       filterCriteria.value[0].operation,
    //       filterCriteria.value[0].value
    //     )
    //   }
    console.log(jsonData)
  }
  const updateFilters = async (newFilters) => {
    filters.value = newFilters
    setTimeout(() => {
      console.log(filters.value)
    }, 1000)
  }
  const updateSorts = async (newSorts) => {
    sorts.value = newSorts
    setTimeout(() => {
      console.log(sorts.value)
    }, 1000)
  }

  const getSorts = () => {
    setTimeout(() => {
      return sorts.value
    }, 1000)
  }
  const getFilters = () => {
    setTimeout(() => {
      return filters.value
    }, 1000)
  }

  return {
    getSorts,
    getFilters,
    refineData,
    updateSorts,
    updateFilters
  }
}
