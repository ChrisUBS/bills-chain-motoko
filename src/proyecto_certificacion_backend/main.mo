import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";

actor Main {

    // Variable que almacena las facturas con un identificador único
    var bills : [(Text, Text, Text, Text, Text, Text)] = [
        // (id, nombre, creador, descripción, estado, pagador)
        ("1", "Recibo de agua", "xwnu2-xzp3k-zcy2z-xrly6-enw7v-bzbl7-2hl2o-6iklr-mljdu-6c5nh-yae", 
        "Factura correspondiente al consumo de agua potable en el hogar durante el mes de octubre de 2024. Monto a pagar en fecha límite de vencimiento.",
        "No pagado", ""),
        
        ("2", "Netflix", "xwnu2-xzp3k-zcy2z-xrly6-enw7v-bzbl7-2hl2o-6iklr-mljdu-6c5nh-yae", 
        "Suscripción mensual al servicio de streaming Netflix. Factura correspondiente a la renovación automática del plan Premium para el mes de noviembre de 2024.",
        "Pagado", "xwnu2-xzp3k-zcy2z-xrly6-enw7v-bzbl7-2hl2o-6iklr-mljdu-6c5nh-yae"),
        
        ("3", "Recibo de luz", "xwnu2-xzp3k-zcy2z-xrly6-enw7v-bzbl7-2hl2o-6iklr-mljdu-6c5nh-yae", 
        "Factura por el consumo de energía eléctrica para el hogar. Corresponde al consumo medido durante octubre de 2024, con fecha límite de pago en noviembre de 2024.",
        "No pagado", "")
    ];

    // Generar un nuevo ID para cada factura
    var nextId : Nat = 4;

    // Agregar una nueva factura
    public func addBill(name: Text, description: Text, creator: Principal) : async () {
        let newId = Nat.toText(nextId);
        let newBill = (newId, name, Principal.toText(creator), description, "No pagado", "");
        bills := Array.append(bills, [newBill]);
        nextId := nextId + 1;
    };

    // Retornar todas las facturas
    public query func getBills() : async [(Text, Text, Text, Text, Text, Text)] {
        return Array.reverse(bills);
    };

    // Filtrar las facturas y eliminar la que coincida con el id
    public func deleteBill(id: Text) : async () {
        bills := Array.filter(bills, func(bill: (Text, Text, Text, Text, Text, Text)) : Bool {
            return bill.0 != id;
        });
    };

    // Pagar una factura
    public func payBill(id: Text, userPrincipal: Principal) : async () {
        bills := Array.map<(Text, Text, Text, Text, Text, Text), (Text, Text, Text, Text, Text, Text)>(
            bills, 
            func(bill: (Text, Text, Text, Text, Text, Text)) : (Text, Text, Text, Text, Text, Text) {
                if (bill.0 == id and bill.4 == "No pagado") {
                    (bill.0, bill.1, bill.2, bill.3, "Pagado", Principal.toText(userPrincipal))
                } else {
                    bill
                }
            }
        );
    };
};
