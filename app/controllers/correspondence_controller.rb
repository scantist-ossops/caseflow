class CorrespondenceController < ApplicationController
  before_action :verify_feature_toggle
  before_action :correspondence

  def intake
    respond_to do |format|
      format.html { return render "correspondence/intake" }
      format.json do
        render json: {
          correspondences: correspondences
        }
      end
    end
  end

  private

  def verify_feature_toggle
    if !FeatureToggle.enabled?(:correspondence_queue)
      redirect_to "/unauthorized"
    end
  end

  def correspondence
    @correspondence ||= Correspondence.find_by(uuid: params[:correspondence_uuid])
  end

  def correspondences
    Correspondence.where(veteran_id: veteran_by_correspondence.id)
  end

  def veteran_by_correspondence
    Veteran.find(@correspondence.veteran_id)
  end
end
