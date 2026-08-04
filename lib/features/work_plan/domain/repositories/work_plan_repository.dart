import '../../data/models/customer_model.dart';
import '../../data/models/deviation_model.dart';
import '../../data/models/joint_work_model.dart';
import '../../data/models/work_plan_summary_model.dart';

abstract class WorkPlanRepository {
  Future<WorkPlanSummaryModel> getTodaySummary(String employeeId);
  Future<List<CustomerModel>> getTodayCustomers(String employeeId);
  Future<List<CustomerModel>> searchAllCustomers(String query);
  Future<void> logDeviation(DeviationModel deviation);
  Future<void> submitJointWork(JointWorkModel jointWork);
  Future<CustomerModel> addCustomer(CustomerModel customer);
}
