import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { CakeIcon } from "react-native-heroicons/outline";
import DateTimePicker from "@react-native-community/datetimepicker";
import useAuth from "../hooks/useAuth";

const EditDate = ({ dateOfBirth }) => {
  const [date, setDate] = useState();
  const [isDatePickerActive, setIsDatePickerActive] = useState(false);
  const { updateUserDateOfBirth, refreshUser } = useAuth();

  useEffect(() => {
    dateOfBirth ? setDate(new Date(dateOfBirth)) : setDate(2000, 0, 1);
  }, []);

  const handleEdit = async () => {
    updateUserDateOfBirth(date);
    refreshUser();
  };
  return (
    <TouchableOpacity
      onPress={() => {
        setIsDatePickerActive(true);
      }}
      className="flex-row items-center justify-center space-x-1 bg-violet-200 py-4 rounded-xl mx-2 mt-5 shadow-lg shadow-black"
    >
      {date && isDatePickerActive && (
        <DateTimePicker
          onChange={(event, date) => {
            setDate(date);
            setIsDatePickerActive(false);
            handleEdit();
          }}
          locale="pl-Pl"
          value={date}
          mode="date"
        />
      )}
      <Text className="text-center font-semibold">Edytuj datę urodzenia</Text>
      <CakeIcon size={30} color="black" />
    </TouchableOpacity>
  );
};

export default EditDate;
