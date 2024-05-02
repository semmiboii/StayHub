import { useMutation } from "react-query";
import ManageHotelForms from "../forms/ManageHotelForm/ManageHotelForms";

import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const AddHotel = () => {
  const { showToast } = useAppContext();

  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };
  return <ManageHotelForms onSave={handleSave} isLoading={isLoading} />;
};

export default AddHotel;
