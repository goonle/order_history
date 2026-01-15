import VendorAdd from "./VendorAdd";
import EmptyCard from "./EmptyCard";
import VendorRow from "./VendorRow";
import { Vendor } from "@/app/model/vendor";
import { VendorData } from "@/app/model/vendor";
import Spinner from "@/app/components/ui/Spinner";

export default function VendorPanel(props: {
  loading?: boolean;
  vendors: Vendor[];
  selectedVendorId: number;
  setSelectedVendorId: (vendorId: number) => void;
  addVendor: (vendorData: VendorData) => void;
  updateVendor : (vendorDataWithId: Vendor) => void;
  deleteVendor: (vendorId: number) => void;
}) {
  const {
    loading,
    vendors,
    selectedVendorId,
    setSelectedVendorId,
    addVendor, deleteVendor,
  } = props;

  return (
    <section className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Vendors</h2>
          <p className="text-sm text-slate-500">Add / rename / select vendors.</p>
        </div>
        <VendorAdd onAdd={addVendor} />
      </div>
      <div className="min-h-[220px]">
        {/* Panel Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
            <Spinner />
          </div>
        )}
        <div className="space-y-2">
          {vendors.length === 0 ? (
            <EmptyCard title="No vendors yet" desc="Create your first vendor to add items." />
          ) : (
            vendors.map((v: Vendor) => (
              <VendorRow
                key={v.id}
                vendor={v}
                selected={v.id === selectedVendorId}
                onSelect={() => setSelectedVendorId(v.id)}
                onDelete={() => deleteVendor(v.id)}
                onUpdate={(vendorDataWithId: Vendor) => props.updateVendor(vendorDataWithId)}
              />
            ))
          )}
        </div>
      </div>
    </section>

  )
}