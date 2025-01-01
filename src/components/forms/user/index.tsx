import { UserReduxState } from "@reducers/user";
import { FormOptionsState } from "@reducers/formOptions";
import NotificationValues from "@typings/NotificationValues";

import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import { connect } from "react-redux";

import { registerPlayer, updateProfile } from "@actions/user";
import { getCountries, getRegions, getCities } from "@actions/formOptions";
import { addNotification } from "@actions/notifications";
import { SET_REGIONS, SET_CITIES } from "@actions/index";

import updateField from "@utils/forms/updateField";
import checkValidity from "@utils/forms/checkValidity";
import checkValidEmail from "@utils/forms/checkValidEmail";
import checkMatchingPasswords from "@utils/forms/checkMatchingPasswords";

import Input from "../controls/Input";
import Select from "../controls/Select";
import Spinner from "@components/loaders/spinner";

import s from "./styles.module.css";

interface Props {
  formOptions: FormOptionsState;
  getCountries: () => Promise<void>;
  getRegions: (countryName: number) => Promise<void>;
  resetRegions: (setCurrentData: React.Dispatch<React.SetStateAction<UserFormData>>) => void;
  getCities: (regionName: number) => Promise<void>;
  resetCities: (setCurrentData: React.Dispatch<React.SetStateAction<UserFormData>>) => void;
  user: UserReduxState;
  registerPlayer: (
    userData: UserFormData,
    formRef: React.RefObject<HTMLFormElement>,
    setForm: React.Dispatch<
      React.SetStateAction<{
        processing: boolean;
      }>
    >
  ) => Promise<void>;
  updateProfile: (
    userData: UserFormData,
    formRef: React.RefObject<HTMLFormElement>,
    setForm: React.Dispatch<
      React.SetStateAction<{
        processing: boolean;
      }>
    >
  ) => Promise<any>;
  addNotification: (data: Omit<NotificationValues, "id">) => void;
  referral?: string | null;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  education: null | number;
  school: string;
  country: null | number;
  region: null | number;
  city: null | number;
}

const UserForm: React.FC<Props> = ({
  formOptions,
  getCountries,
  getRegions,
  resetRegions,
  getCities,
  resetCities,
  user,
  registerPlayer,
  updateProfile,
  addNotification,
  referral
}) => {
  const formRef = useRef<HTMLFormElement>(null),
    [form, setForm] = useState({
      processing: false,
    }),
    [currentData, setCurrentData] = useState<UserFormData>({
      name: user.credentials?.name ?? "",
      email: user.credentials?.email ?? "",
      password: "",
      password_confirmation: "",
      education: user.credentials?.education ?? null,
      school: user.credentials?.school ?? "",
      country: user.credentials?.country ?? null,
      region: user.credentials?.region ?? null,
      city: user.credentials?.city ?? null
    });

  useEffect(() => {
    if (!formOptions.countries.length) getCountries();
  }, []);

  useEffect(() => {
    if (currentData.country) {
      getRegions(currentData.country);
      if (currentData.region) resetRegions(setCurrentData);
      if (currentData.city) resetCities(setCurrentData);
    }
  }, [currentData.country]);

  useEffect(() => {
    if (currentData.region) {
      getCities(currentData.region);
      if (currentData.city) resetCities(setCurrentData);
    }
  }, [currentData.region]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fields = document.querySelectorAll<
      HTMLInputElement | HTMLSelectElement
    >(
      "#userForm input,#userForm select, #registerForm input,#registerForm select"
    );
    let valid = true,
      passwordValue: string;

    let relevantData: any = {},
      changedData: any = {};

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.name === "email" && field.value)
        checkValidEmail(field as HTMLInputElement);

      if (
        user.tokens.access &&
        ["password", "password_confirmation"].includes(field.name)
      ) {
        continue;
      } else {
        if (!user.tokens.access && field.name === "password")
          passwordValue = field.value;
        if (!user.tokens.access && field.name === "password_confirmation") {
          checkMatchingPasswords(field as HTMLInputElement, passwordValue!);
        } else {
          checkValidity(field);
        }
      }

      if (!field.validity.valid && valid) valid = false;

      if (valid) {
        if (user.tokens.access) {
          const userCredentialsValue =
              user.credentials && (user.credentials as any)[field.name],
            fieldValue = parseInt(field.value)
              ? parseInt(field.value)
              : field.value;

          if (
            (!fieldValue && userCredentialsValue) ||
            fieldValue === userCredentialsValue
          ) {
            relevantData[field.name] = userCredentialsValue;
          } else if (fieldValue && fieldValue !== userCredentialsValue) {
            relevantData[field.name] = field.value;
            changedData[field.name] = field.value;
          }
        } else {
          if (field.value) relevantData[field.name] = field.value;
        }
      }
    }

    if (user.tokens.access && !Object.keys(changedData).length) {
      addNotification({
        error: true,
        content: "Nothing to update",
        close: false,
        duration: 0
      });
    } else if (valid) {
      if (user.tokens.access) {
        setForm((prev) => ({ ...prev, processing: true }));
        await updateProfile(relevantData, formRef, setForm);
      } else {
        setForm((prev) => ({ ...prev, processing: true }));
        const queries = referral?.split("&");

        await registerPlayer(
          {
            ...relevantData,
            ...(referral && {
              referral_code: queries![0].split("=")[1],
              version_id: queries![1].split("=")[1]
            })
          },
          formRef,
          setForm
        );
      }
    }
  };

  return (
    <>
      {!user.tokens.access && (
        <div className={s.detail} aria-label="* Means the Field is Required">
          Required: <span className={s.required}>*</span>
        </div>
      )}
      <form
        id={user.tokens.access ? "userForm" : "registerForm"}
        onSubmit={(e) => submit(e)}
        className={s.form}
        ref={formRef}
        autoComplete="off"
        noValidate
      >
        <div role="presentation">
          <label htmlFor="name">
            Name
            {!user.tokens.access && (
              <span aria-hidden="true" className={s.required}>
                *
              </span>
            )}
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            onChange={(e) => updateField<UserFormData>(e, setCurrentData)}
            disabled={form.processing}
            {...(currentData.name && { defaultValue: currentData.name })}
            autoComplete="off"
            {...(!user.tokens.access && { required: true })}
            minLength={2}
          />
        </div>

        <div role="presentation">
          <label htmlFor="email">
            Email
            {!user.tokens.access && (
              <span aria-hidden="true" className={s.required}>
                *
              </span>
            )}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            errorMsg="Not a valid email address"
            onChange={(e) => updateField<UserFormData>(e, setCurrentData)}
            disabled={form.processing}
            {...(currentData.email && { defaultValue: currentData.email })}
            autoComplete="off"
            {...(!user.tokens.access && { required: true })}
          />
        </div>

        {/* This is for the register only. */}
        <span
          style={{
            display: user.tokens.access ? "none" : "",
          }}
        >
          <div role="presentation">
            <label aria-label="Password" htmlFor="password">
              Pass
              <span aria-hidden="true" className={s.required}>
                *
              </span>
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              errorMsg="Must be between 8 and 24 characters"
              onChange={(e) => updateField<UserFormData>(e, setCurrentData)}
              disabled={form.processing}
              autoComplete="off"
              minLength={8}
              maxLength={24}
              required
            />
          </div>
          <div role="presentation">
            <label
              aria-label="Confirm Password"
              htmlFor="password_confirmation"
            >
              Confirm Pass
              <span aria-hidden="true" className={s.required}>
                *
              </span>
            </label>
            <Input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              errorMsg="Passwords do not match"
              onChange={(e) => updateField<UserFormData>(e, setCurrentData)}
              disabled={form.processing}
              autoComplete="off"
              minLength={8}
              maxLength={24}
              required
            />
          </div>
        </span>

        <span>
          <div role="presentation">
            <label htmlFor="education">
              Education
              {!user.tokens.access && (
                <span aria-hidden="true" className={s.required}>
                  *
                </span>
              )}
            </label>
            <Select
              id="education"
              name="education"
              onChange={(e) => updateField<UserFormData>(e, setCurrentData)}
              disabled={form.processing}
              {...(currentData.education && {
                defaultValue: currentData.education,
              })}
              {...(!user.tokens.access && { required: true })}
            >
              <option value="">- Select -</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 9">Grade 10</option>
              <option value="Grade 9">Grade 11</option>
              <option value="Grade 9">Grade 12</option>
              <option value="Other">Other</option>
            </Select>
          </div>
          
          <div role="presentation">
            <label htmlFor="school">School</label>
            <Input
              id="school"
              name="school"
              type="text"
              onChange={(e) => updateField<UserFormData>(e, setCurrentData)}
              disabled={!currentData.education || form.processing}
              {...(currentData.school && { defaultValue: currentData.school })}
              autoComplete="off"
            />
          </div>
        </span>

        <span>
          <div role="presentation">
            <label htmlFor="country">
              Country
              {!user.tokens.access && (
                <span aria-hidden="true" className={s.required}>
                  *
                </span>
              )}
            </label>
            <Select
              id="country"
              name="country"
              onChange={(e) => updateField<UserFormData>(e, setCurrentData)}
              disabled={form.processing}
              {...(currentData.country && { value: currentData.country })}
              {...(!user.tokens.access && { required: true })}
            >
              <option value="">- Select -</option>
              {formOptions.countries &&
                formOptions.countries.map((country, index) => {
                  return (
                    <option key={index} value={country.name}>
                      {country.name}
                    </option>
                  );
                })}
            </Select>
          </div>
          <div role="presentation">
            <label htmlFor="region">Region</label>
            <Select
              aria-live="polite"
              aria-busy={formOptions.regions.length === 0}
              id="region"
              name="region"
              onChange={(e) => updateField<UserFormData>(e, setCurrentData)}
              disabled={
                !currentData.country ||
                formOptions.regions.length === 0 ||
                typeof formOptions.regions === "string" ||
                form.processing
              }
              {...(currentData.region && { value: currentData.region })}
            >
              <option value="">- Select -</option>
              {formOptions.regions &&
                typeof formOptions.regions !== "string" &&
                formOptions.regions.map((region, index) => {
                  return (
                    <option key={index} value={region.name}>
                      {region.name}
                    </option>
                  );
                })}
            </Select>
            {formOptions.regions.length === 0 && currentData.country && (
              <Spinner />
            )}
            {typeof formOptions.regions === "string" && (
              <small className={s.notFoundMsg}>
                {formOptions.regions}
              </small>
            )}
          </div>
        </span>

        <div
          role="presentation"
          {...(user.tokens.access &&
            typeof formOptions.regions === "string" && {
              className: s.notFoundMsg
            })}
        >
          <label htmlFor="city">City</label>
          <Select
            aria-live="polite"
            aria-busy={formOptions.cities.length === 0}
            id="city"
            name="city"
            onChange={(e) => updateField<UserFormData>(e, setCurrentData)}
            disabled={
              !currentData.region ||
              formOptions.cities.length === 0 ||
              typeof formOptions.regions === "string" ||
              typeof formOptions.cities === "string" ||
              form.processing
            }
            {...(currentData.city && { value: currentData.city })}
          >
            <option value="">- Select -</option>
            {formOptions.cities &&
              typeof formOptions.cities !== "string" &&
              formOptions.cities.map((city, index) => {
                return (
                  <option key={index} value={city.name}>
                    {city.name}
                  </option>
                );
              })}
          </Select>
          {formOptions.cities.length === 0 &&
            currentData.region &&
            currentData.region !== user.credentials?.region && (
              <Spinner />
            )}
          {typeof formOptions.regions === "string" ? (
            <small className={s.notFoundMsg}>{formOptions.regions}</small>
          ) : (
            typeof formOptions.cities === "string" && (
              <small className={s.notFoundMsg}>{formOptions.cities}</small>
            )
          )}
        </div>

        <div>
          {user.tokens.access ? (
            <button
              type="submit"
              className="updateBtn"
              disabled={form.processing}
            >
              Update
            </button>
          ) : (
            <>
              <Link to="/login" className="fade move">
                Already have a account?
              </Link>
              <button
                type="submit"
                className="okBtn flip"
                disabled={form.processing}
              />
            </>
          )}
        </div>
      </form>
    </>
  );
};

const mapStateToProps = ({
  user,
  formOptions
}: {
  user: UserReduxState;
  formOptions: FormOptionsState;
}) => ({
  user,
  formOptions
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  getCountries: () => dispatch(getCountries() as unknown) as Promise<void>,
  getRegions: (countryName: number) =>
    dispatch(getRegions(countryName) as unknown) as Promise<void>,
  getCities: (regionName: number) =>
    dispatch(getCities(regionName) as unknown) as Promise<void>,
  registerPlayer: (
    userData: UserFormData,
    formRef: React.RefObject<HTMLFormElement>,
    setForm: React.Dispatch<
      React.SetStateAction<{ processing: boolean }>
    >
  ) =>
    dispatch(
      registerPlayer(userData, formRef, setForm) as unknown
    ) as Promise<void>,
  updateProfile: (
    userData: UserFormData,
    formRef: React.RefObject<HTMLFormElement>,
    setForm: React.Dispatch<
      React.SetStateAction<{ processing: boolean }>
    >
  ) =>
    dispatch(
      updateProfile(userData, formRef, setForm) as unknown
    ) as Promise<any>,
  addNotification: (notification: Omit<NotificationValues, "id">) =>
    dispatch(addNotification(notification)),

  resetRegions: (setCurrentData: React.Dispatch<React.SetStateAction<UserFormData>>) => {
    setCurrentData((prev) => ({ ...prev, region: null }));
    dispatch({ type: SET_REGIONS, payload: [] });
  },
  resetCities: (setCurrentData: React.Dispatch<React.SetStateAction<UserFormData>>) => {
    setCurrentData((prev) => ({ ...prev, city: null }));
    dispatch({ type: SET_CITIES, payload: [] });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
