import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../core/storage/local_storage_service.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/inputs/app_text_field.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../providers/auth_state.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _userIdController = TextEditingController();
  final _passwordController = TextEditingController();
  
  bool _obscurePassword = true;
  bool _rememberMe = false;

  @override
  void initState() {
    super.initState();
    // Use Future.microtask to access ref inside initState safely
    Future.microtask(() {
      final localStorage = ref.read(localStorageProvider);
      final savedUserId = localStorage.getSavedUserId();
      final rememberMe = localStorage.getRememberMe();
      
      if (savedUserId != null && rememberMe) {
        setState(() {
          _userIdController.text = savedUserId;
          _rememberMe = rememberMe;
        });
      }
    });
  }

  @override
  void dispose() {
    _userIdController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    if (_formKey.currentState?.validate() ?? false) {
      ref.read(authNotifierProvider.notifier).login(
        _userIdController.text.trim(),
        _passwordController.text,
        _rememberMe,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<AuthState>(authNotifierProvider, (previous, next) {
      if (next is AuthStateError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      } else if (next is AuthStateAuthenticated) {
        AppFeedback.showSnackBar(context, 'Login Successful');
        if (next.user.role == 'Super Admin') {
          context.go('/super-admin-dashboard');
        } else if (next.user.role == 'Admin') {
          context.go('/admin-dashboard');
        } else if (next.user.role == 'AM' || next.user.role == 'RM') {
          context.go('/manager-dashboard');
        } else {
          context.go('/dashboard');
        }
      }
    });

    final authState = ref.watch(authNotifierProvider);
    final isLoading = authState is AuthStateLoading;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSizes.p24),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Logo
                  Icon(
                    Icons.business_center,
                    size: 80,
                    color: AppColors.primary,
                  ),
                  AppSizes.gap16,
                  
                  // App Name & Welcome
                  Text(
                    AppStrings.appName,
                    style: AppTypography.headlineMedium.copyWith(color: AppColors.primary),
                    textAlign: TextAlign.center,
                  ),
                  AppSizes.gap8,
                  Text(
                    'Enter your credentials to continue',
                    style: AppTypography.bodyMedium.copyWith(color: AppColors.grey600),
                    textAlign: TextAlign.center,
                  ),
                  AppSizes.gap32,

                  // User ID Field
                  AppTextField(
                    label: 'User ID',
                    hint: 'Enter your Employee ID',
                    controller: _userIdController,
                    prefixIcon: const Icon(Icons.person_outline),
                    keyboardType: TextInputType.text,
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Please enter your User ID';
                      }
                      return null;
                    },
                  ),
                  AppSizes.gap16,

                  // Password Field
                  AppTextField(
                    label: 'Password',
                    hint: 'Enter your password',
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    prefixIcon: const Icon(Icons.lock_outline),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword ? Icons.visibility_off : Icons.visibility,
                        color: AppColors.grey500,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your password';
                      }
                      return null;
                    },
                  ),
                  AppSizes.gap8,

                  // Remember Me & Forgot Password
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Checkbox(
                            value: _rememberMe,
                            activeColor: AppColors.primary,
                            onChanged: (value) {
                              setState(() {
                                _rememberMe = value ?? false;
                              });
                            },
                          ),
                          Text('Remember Me', style: AppTypography.bodyMedium),
                        ],
                      ),
                      TextButton(
                        onPressed: isLoading ? null : () {
                          // Implement forgot password
                        },
                        child: const Text('Forgot Password?'),
                      ),
                    ],
                  ),
                  AppSizes.gap24,

                  // Login Button
                  AppButton(
                    text: 'Login',
                    onPressed: isLoading ? null : _handleLogin,
                    isLoading: isLoading,
                  ),
                  
                  AppSizes.gap32,
                  
                  AppSizes.gap32,
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ElevatedButton(onPressed: () => context.go('/admin-dashboard'), child: const Text('Admin')),
                      ElevatedButton(onPressed: () => context.go('/super-admin-dashboard'), child: const Text('Super Admin')),
                    ],
                  ),
                  AppSizes.gap16,
                  // App Version
                  Text(
                    'Version 1.0.0',
                    style: AppTypography.bodySmall.copyWith(color: AppColors.grey500),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
