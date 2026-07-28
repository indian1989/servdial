const defaultHours = {
  monday: { open: "", close: "", closed: false, is24h: false },
  tuesday: { open: "", close: "", closed: false, is24h: false },
  wednesday: { open: "", close: "", closed: false, is24h: false },
  thursday: { open: "", close: "", closed: false, is24h: false },
  friday: { open: "", close: "", closed: false, is24h: false },
  saturday: { open: "", close: "", closed: false, is24h: false },
  sunday: { open: "", close: "", closed: false, is24h: false },
};

export const normalizeBusinessHours = (hours = {}) => {
  const result = structuredClone(defaultHours);

  Object.keys(result).forEach((day) => {
    if (!hours?.[day]) return;

    result[day] = {
      open: hours[day].open || "",
      close: hours[day].close || "",
      closed: Boolean(hours[day].closed),
      is24h: Boolean(hours[day].is24h),
    };
  });

  return result;
};