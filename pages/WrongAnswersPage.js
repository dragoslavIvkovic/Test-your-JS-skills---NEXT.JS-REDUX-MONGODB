import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'

function WrongAnswersPage () {
  const wrongQuestion = useSelector(state => state.wrongQuestions)
  console.log(wrongQuestion)

  return <div>WrongAnswersPage</div>
}

export default WrongAnswersPage
