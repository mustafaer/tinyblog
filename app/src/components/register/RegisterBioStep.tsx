import { IOption, IRegisterStep } from "@/interfaces";
import RegisterStep from "./RegisterStep";
import TextInput from "../inputs/TextInput";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { IValidationResult, validate } from "robust-validator";
import api from "@/api";
import { notification } from "@/helpers/notication";
import TextareaInput from "../inputs/TextareaInput";
import SelectInput, { SelectInputModelType } from "../inputs/SelectInput";
import { SUPPORTED_LOCATIONS } from "@/consts";
import { loading } from "@/helpers/layout";
import Checkbox from "../inputs/Checkbox";
import { Link } from "react-router-dom";

type LocationType = IOption | null;

export const RegisterBioStep = ({ state, next }: IRegisterStep) => {
  const { t } = useTranslation();
  const [internalState, setInternalState] = useState({
    name: "",
    bio: "",
    location: SUPPORTED_LOCATIONS.find((item) => item.value === "WW") || null,
    isConfirmed: false,
  });
  const [validation, setValidation] = useState<IValidationResult>();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    setInternalState({
      ...internalState,
      [field]: event.target.value,
    });
  };

  const setLocation = (selection: LocationType) => {
    setInternalState({
      ...internalState,
      location: selection,
    });
  };

  const patchData = async () => {
    loading(true);
    const response = await api.registration.patch(state.id, {
      name: internalState.name,
      bio: internalState.bio,
      location: internalState.location?.value || "WW",
    });
    loading(false);

    if (response.status === 200) {
      return next();
    } else if (response.status === 400) {
      const { error } = await response.json();
      return notification.error(error);
    }

    notification.error("An error occurred");
  };

  const handleNext = async () => {
    setValidation(undefined);
    const data = {
      ...internalState,
      isConfirmed: internalState.isConfirmed || undefined,
    };
    const result = await validate(data, {
      name: "required|min:3|max:50",
      bio: "max:240",
      location: "required",
      isConfirmed: "required",
    });
    setValidation(result);
    if (result.isInvalid) {
      return;
    }

    await patchData();
  };

  return (
    <RegisterStep onNext={handleNext}>
      <div className="flex flex-col gap-4">
        <TextInput
          name="name"
          label={t("register.name.label")}
          placeholder={t("register.name.placeholder")}
          value={internalState.name}
          onChange={(event) => handleChange(event, "name")}
          validation={validation}
        />
        <TextareaInput
          name="bio"
          label="Biography"
          description="You may describe yourself in 240 characters."
          value={internalState.bio}
          placeholder="You may write something about yourself..."
          onChange={(event) => handleChange(event, "bio")}
          maxLength={240}
        />
        <SelectInput
          name="location"
          value={internalState.location}
          setValue={(value: SelectInputModelType) =>
            setLocation(value as LocationType)
          }
          label="Default location"
          description="Choose your default location to tag your posts. This location helps others see where you're posting from and customizes your feed to show posts from selected regions."
          options={SUPPORTED_LOCATIONS}
        />
        <Checkbox
          name="isConfirmed"
          checked={internalState.isConfirmed}
          onChange={(isConfirmed) =>
            setInternalState({
              ...internalState,
              isConfirmed,
            })
          }
          validation={validation}
        >
          I agree to the{" "}
          <Link
            to="/terms"
            target="_blank"
            className="font-semibold hover:underline"
          >
            Terms of Service
          </Link>
          ,{" "}
          <Link
            to="/privacy-policy"
            target="_blank"
            className="font-semibold hover:underline"
          >
            Privacy Policy
          </Link>
          , and{" "}
          <Link
            to="/cookie-policy"
            target="_blank"
            className="font-semibold hover:underline"
          >
            Cookie Policy.
          </Link>
        </Checkbox>
      </div>
    </RegisterStep>
  );
};

export default RegisterBioStep;
