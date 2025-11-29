import { useFormattedDate } from '~/hooks/use-formatted-date'

interface FormattedDateCellProps {
  date: Date
}

function FormattedDateCell(props: FormattedDateCellProps) {
  const { date } = props

  const formattedDate = useFormattedDate(date, {
    format: 'YYYY-MM-DD HH:mm:ss',
  })

  return formattedDate
}

export default FormattedDateCell
