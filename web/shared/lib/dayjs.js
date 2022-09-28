import dayjs from 'dayjs'
import dayjsLocale from 'dayjs/locale/es'
import updateLocale from 'dayjs/plugin/updateLocale'
import relativeTime from 'dayjs/plugin/relativeTime'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

const TZ = 'America/Costa_Rica'

dayjs.locale('es')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(updateLocale)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)

dayjs.tz.setDefault(TZ)

dayjs.locale(
  {
    ...dayjsLocale,
    monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mié._Jue._Vie._Sáb.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
      '_'
    )
  },
  null,
  true
)

dayjs.updateLocale('es', {
  relativeTime: {
    future: '%s',
    past: '%s',
    s: 'segundos',
    m: '1 min',
    mm: '%d min',
    h: '1 hora',
    hh: '%d horas',
    d: '1 día',
    dd: '%d días',
    M: '1 mes',
    MM: '%d meses',
    y: '1 año',
    yy: '%d años'
  }
})
