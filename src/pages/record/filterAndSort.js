// This component is made to imitate the data refining thats going to be happening in the backend

export const filterAndSort = () => {
  const refineData = () => {
    console.log('API CALL!!')
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
  }

  return {
    refineData
  }
}
