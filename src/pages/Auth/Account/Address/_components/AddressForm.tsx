import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AddressCreateSchema, type AddressCreateInput, type AddressUpdateInput } from "@/lib/schema/address.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useProvinces, useCities, useDistricts } from '@/api/queries/address'
import SelectField from "@/components/common/SelectField"

interface RajaOngkirRegion {
  id: string | number
  name: string
}

interface AddressFormProps {
  defaultValues?: AddressUpdateInput
  onSubmit: (data: AddressCreateInput) => void
  isPending: boolean
  onCancel: () => void
}

const AddressForm = ({ defaultValues, onSubmit, isPending, onCancel }: AddressFormProps) => {
  const [provinceId, setProvinceId] = useState(defaultValues?.province_id ?? "")
  const [cityId, setCityId] = useState(defaultValues?.city_id ?? "")
  const [districtId, setDistrictId] = useState(defaultValues?.district_id ?? "")

  const { data: provinceRes, isLoading: loadingProvinces } = useProvinces()
  const { data: citiesRes, isLoading: loadingCities } = useCities(provinceId)
  const { data: districtsRes,isLoading: loadingDistricts } = useDistricts(cityId)

  const provinces: RajaOngkirRegion[] = provinceRes?.data  ?? provinceRes ?? []
  const cities: RajaOngkirRegion[] = citiesRes?.data ?? citiesRes ?? []
  const districts: RajaOngkirRegion[] = districtsRes?.data ?? districtsRes ?? []

  const { register, setValue, handleSubmit, formState: { errors } } = useForm<AddressCreateInput>({
    resolver: zodResolver(AddressCreateSchema),
    defaultValues,
  })

  const handleProvinceChange = (id: string, name: string) => {
    setProvinceId(id)
    setCityId("")
    setDistrictId("")
    setValue("province", name, { shouldValidate: true })
    setValue("province_id", id, { shouldValidate: true })
    setValue("city", "", { shouldValidate: false })
    setValue("city_id", "", { shouldValidate: false })
    setValue("district", "", { shouldValidate: false })
    setValue("district_id", "", { shouldValidate: false })
  }

  const handleCityChange = (id: string, name: string) => {
    setCityId(id)
    setDistrictId("")
    setValue("city", name, { shouldValidate: true })
    setValue("city_id", id, { shouldValidate: true })
    setValue("district", "", { shouldValidate: false })
    setValue("district_id", "", { shouldValidate: false })
  }

  const handleDistrictChange = (id: string, name: string) => {
    setDistrictId(id)
    setValue("district", name, { shouldValidate: true })
    setValue("district_id", id, { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label className="mb-2 block">Recipient Name</Label>
          <Input {...register("name")} placeholder="John Doe" />
          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div className="col-span-2">
          <Label className="mb-2 block">Phone Number</Label>
          <Input {...register("phone")} placeholder="+62..." />
          {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div className="col-span-2 md:col-span-1">
          <SelectField
            label="Province"
            value={provinceId}
            placeholder={loadingProvinces ? "Loading..." : "Select Province"}
            options={provinces.map((p) => ({ id: String(p.id), name: p.name }))}
            onChange={handleProvinceChange}
            error={errors.province?.message}
          />
          <input type="hidden" {...register("province")} />
          <input type="hidden" {...register("province_id")} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <SelectField
            label="City / Regency"
            value={cityId}
            placeholder={!provinceId ? "Select province first" : loadingCities ? "Loading..." : "Select City"}
            options={cities.map((c) => ({ id: String(c.id), name: c.name }))}
            onChange={handleCityChange}
            disabled={!provinceId}
            error={errors.city?.message}
          />
          <input type="hidden" {...register("city")} />
          <input type="hidden" {...register("city_id")} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <SelectField
            label="District"
            value={districtId}
            placeholder={!cityId ? "Select city first" : loadingDistricts ? "Loading..." : "Select District"}
            options={districts.map((d) => ({ id: String(d.id), name: d.name }))}
            onChange={handleDistrictChange}
            disabled={!cityId}
            error={errors.district?.message}
          />
          <input type="hidden" {...register("district")} />
          <input type="hidden" {...register("district_id")} />
        </div>
        <div>
          <Label className="mb-2 block">ZIP Code</Label>
          <Input {...register("zip")} placeholder="e.g. 12110" />
          {errors.zip && <p className="text-destructive text-xs mt-1">{errors.zip.message}</p>}
        </div>
        <div className="col-span-2">
          <Label className="mb-2 block">Street Address</Label>
          <Input {...register("street")} placeholder="e.g. Jl. Sudirman No. 10" />
          {errors.street && <p className="text-destructive text-xs mt-1">{errors.street.message}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  )
}

export default AddressForm