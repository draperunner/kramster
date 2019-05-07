import Helpers from '../../utils/Helpers'

// Returns a pretty header for the school (the abbreviated name)
export const header = (school) => {
  // Find abbreviation enclosed in parenthesis
  const abb = Helpers.findSubstringEnclosedInParenthesis(school)
  if (abb) return abb[1]

  // If no abbreviation, make one from the leading letters in each word
  return school.split(' ').map(e => e[0]).join('')
}

// Returns the full name of the school. Removes abbr. and parenthesis from school string
export const name = (school) => {
  // Find abbreviation enclosed in parenthesis
  const abb = Helpers.findSubstringEnclosedInParenthesis(school)
  return (abb) ? school.replace(abb[0], '') : school
}
