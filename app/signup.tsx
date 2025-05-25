import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import text from "@/styles/text";
import link from "@/styles/link";
import layout from "@/styles/layout";
import { signupStyles as styles } from "@/styles/signup";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Input from "@/components/Input";
import { useForm, Controller } from "react-hook-form";
import { SignUpData } from "@/types/user";
import { useRegister } from "@/hooks/useRegister";
import { useAgreement } from "@/hooks/useAgreement";
import { useNavigation } from "@/hooks/useNavigation"; // Custom hook
import CustomButton from "@/components/CustomButton";
import TermsAgreement from "@/components/TermsAgreement";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FormData extends SignUpData {
  confirmPassword: string;
}

export default function SignUp() {
  const { control, handleSubmit, formState: { errors }, getValues, reset } = useForm<FormData>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      confirmPassword: ""
    }
  });
  
  const insets = useSafeAreaInsets();
  const { register, isPending, isError, reset: resetMutation } = useRegister();
  const { agreeToTerms, validateAgreement, setAgreeToTerms } = useAgreement();
  
  // Use custom navigation hook
  const { goToLogin } = useNavigation({
    throttleTime: 1000,
    debounceDelay: 150,
    logErrors: true
  });

  const onSubmit = async (data: FormData) => {
    if (!validateAgreement()) {
      return;
    }

    try {
      if (isError) {
        resetMutation();
      }

      const { confirmPassword, ...signupData } = data;
      await register(signupData);

      reset();
    } catch (error) {
      console.log("Registration attempt failed:", error);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentContainer}>
        <Text style={text.main_title}>Create Account</Text>
        <Text style={[text.sub_title, styles.title]}>
          Fill your information below or register with your social account
        </Text>

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="example@gmail.com"
              keyboardType="email-address"
              inputMode="email"
              secureTextEntry={false}
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <View style={styles.nameContainer}>
          <View style={styles.nameInput}>
            <Controller
              control={control}
              name="firstName"
              rules={{ 
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters"
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="First Name"
                  placeholder="Enter first name"
                  keyboardType="default"
                  inputMode="text"
                  secureTextEntry={false}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.firstName?.message}
                />
              )}
            />
          </View>

          <View style={styles.nameInput}>
            <Controller
              control={control}
              name="lastName"
              rules={{ 
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters"
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Last Name"
                  placeholder="Enter last name"
                  keyboardType="default"
                  inputMode="text"
                  secureTextEntry={false}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.lastName?.message}
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="phone"
          rules={{ 
            required: "Phone is required",
            pattern: {
              value: /^[0-9+\-\s()]{10,}$/,
              message: "Please provide a valid phone number"
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Phone Number"
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
              inputMode="tel"
              secureTextEntry={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.phone?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
              message: "Password must contain at least one letter and one number"
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="*****************"
              keyboardType="default"
              inputMode="text"
              secureTextEntry={true}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Confirm Password is required",
            validate: (value) =>
              value === getValues().password || "Passwords do not match",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirm Password"
              placeholder="*****************"
              keyboardType="default"
              inputMode="text"
              secureTextEntry={true}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <View style={[layout.flex_row, layout.gap_xs]}>
          <TermsAgreement value={agreeToTerms} onChange={setAgreeToTerms} />
        </View>

        <View style={{ marginVertical: 20 }}>
          <CustomButton
            content={isPending ? "Creating Account..." : "Sign Up"}
            onPress={handleSubmit(onSubmit)}
            isPending={isPending}
            disabled={!agreeToTerms || isPending}
          />
        </View>

        <View style={styles.breakStyled}>
          <View style={styles.break}></View>
          <Text style={text.gray_text}>Or sign up with</Text>
          <View style={styles.break}></View>
        </View>

        <View style={[layout.flex_row_center, layout.gap_s, layout.margin_top_m]}>
          <TouchableOpacity style={[layout.container_rounded, layout.flex_row_center]}>
            <FontAwesome name="apple" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={[layout.container_rounded, layout.flex_row_center]}>
            <FontAwesome name="google" size={28} color="#e94335" />
          </TouchableOpacity>
          <TouchableOpacity style={[layout.container_rounded, layout.flex_row_center]}>
            <FontAwesome name="facebook" size={28} color="#3266ce" />
          </TouchableOpacity>
        </View>

        <View
          style={[
            layout.flex_row_center,
            layout.margin_top_m,
            { paddingBottom: insets.bottom + 20 }
          ]}
        >
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={goToLogin}>
            <Text style={link.sub_link}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}