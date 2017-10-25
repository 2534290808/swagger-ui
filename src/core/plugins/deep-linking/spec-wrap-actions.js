//import scrollTo from "scroll-to-element"
import zenscroll from "zenscroll"

let hasHashBeenParsed = false //TODO this forces code to only run once which may prevent scrolling if page not refreshed


export const updateResolved = (ori, { layoutActions, getConfigs }) => (...args) => {
  ori(...args)
  const isDeepLinkingEnabled = getConfigs().deepLinking
  if(!isDeepLinkingEnabled || isDeepLinkingEnabled === "false") {
    return
  }
  if(window.location.hash ) {
    let hash = window.location.hash.slice(1) // # is first character

    if(hash[0] === "!") {
      // Parse UI 2.x shebangs
      hash = hash.slice(1)
    }

    if(hash[0] === "/") {
      // "/pet/addPet" => "pet/addPet"
      // makes the split result cleaner
      // also handles forgotten leading slash
      hash = hash.slice(1)
    }

    let [tag, operationId] = hash.split("/")

    let swaggerUI = document.querySelector(".swagger-ui")
    let myScroller = zenscroll.createScroller(swaggerUI)

    if(tag && operationId) {
      // Pre-expand and scroll to the operation
      layoutActions.show(["operations-tag", tag], true)
      layoutActions.show(["operations", tag, operationId], true)

      let target = document.getElementById(`operations-${tag}-${operationId}`)
      myScroller.to(target)

    } else if(tag) {
      // Pre-expand and scroll to the tag
      layoutActions.show(["operations-tag", tag], true)

      let target = document.getElementById(`operations-tag-${tag}`)
      myScroller.to(target)
    }
  }

  hasHashBeenParsed = true
}
