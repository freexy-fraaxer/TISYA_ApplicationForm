// Form validation utilities

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\+?[\d\s\-()]{8,20}$/;
export const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  if (!phone.trim()) return true; // Optional field
  return phoneRegex.test(phone.trim());
};

export const validateUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Optional field
  return urlRegex.test(url.trim());
};

export const getEmailError = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  if (!validateEmail(email)) return "Please enter a valid email address";
  return null;
};

export const getPhoneError = (phone: string): string | null => {
  if (!phone.trim()) return null; // Optional
  if (/[a-zA-Z]/.test(phone)) return "Only numbers and valid symbols (+, -, space) are allowed";
  if (!validatePhone(phone)) return "Please enter a valid phone number with country code";
  return null;
};

export const getUrlError = (url: string, fieldName: string = "URL"): string | null => {
  if (!url.trim()) return null; // Optional
  if (!validateUrl(url)) return `Please enter a valid ${fieldName}`;
  return null;
};

export const getRequiredError = (value: string, fieldName: string): string | null => {
  if (!value.trim()) return `${fieldName} is required`;
  return null;
};

// Countries list without Israel
export const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bangladesh", "Belarus", "Belgium", "Bosnia and Herzegovina", "Brazil",
  "Bulgaria", "Canada", "Chile", "China", "Colombia", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Georgia", "Germany",
  "Greece", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kosovo", "Kuwait", "Kyrgyzstan", "Latvia",
  "Lebanon", "Libya", "Lithuania", "Malaysia", "Mexico", "Moldova", "Mongolia", "Morocco",
  "Netherlands", "New Zealand", "Nigeria", "North Macedonia", "Norway", "Pakistan",
  "Palestine", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa",
  "South Korea", "Spain", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Thailand", "Tunisia", "Turkey", "Turkmenistan", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uzbekistan", "Vietnam", "Yemen", "Other"
];

// Gender options - "Other" visible but disabled
export const genderOptions = [
  { value: "Male", disabled: false },
  { value: "Female", disabled: false },
  { value: "Other", disabled: true },
];
