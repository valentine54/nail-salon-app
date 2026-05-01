import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <label className="text-xs tracking-widest text-yellow-600">DATE</label>

      <DatePicker
        selected={date}
        onChange={(d) => setDate(d)}
        inline
        calendarClassName="lux-calendar"
      />
    </div>
  );
};

export default CustomCalendar;