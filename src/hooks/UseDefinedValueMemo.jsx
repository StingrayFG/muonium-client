import { useEffect, useState } from 'react';


export function UseDefinedValueMemo (dependencies = []) {

  const [checkedDependencies, setCheckedDependencies] = useState(dependencies)
  const [outputValues, setOutputValues] = useState(dependencies);

  useEffect(() => {
    if (checkedDependencies.toString() !== dependencies.toString()) {
      setCheckedDependencies(dependencies);

      if ((dependencies.filter(v => v).length !== 0)) {
        setOutputValues(dependencies)
      }
    }

  }, [dependencies])

  return outputValues;
}
