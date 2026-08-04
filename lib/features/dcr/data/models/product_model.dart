class ProductModel {
  final String id;
  final String name;
  final String? strength;
  final String? pack;
  final int availableStock;
  final double? price;

  ProductModel({
    required this.id,
    required this.name,
    this.strength,
    this.pack,
    required this.availableStock,
    this.price,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'strength': strength,
        'pack': pack,
        'availableStock': availableStock,
        'price': price,
      };

  factory ProductModel.fromJson(Map<String, dynamic> json) => ProductModel(
        id: json['id'] as String,
        name: json['name'] as String,
        strength: json['strength'] as String?,
        pack: json['pack'] as String?,
        availableStock: json['availableStock'] as int? ?? 0,
        price: json['price'] != null ? (json['price'] as num).toDouble() : null,
      );
}
